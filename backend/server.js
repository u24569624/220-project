const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 5000;
require("dotenv").config();

app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectToDB() {
  try {
    if (!db) {
      await client.connect();
      db = client.db('version-control-db');
      console.log('Connected to MongoDB');
    }
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// ===== AUTHENTICATION ROUTES =====
app.post('/auth/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await connectToDB();
    const user = await db.collection('users').findOne({ username, password });
    if (user) {
      res.json({ success: true, user: { id: user._id.toString(), username: user.username } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const db = await connectToDB();
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already registered' });
    } else {
      const result = await db.collection('users').insertOne({ email, password, name, friends: [], workConnections: '', createdAt: new Date() });
      res.json({ success: true, user: { id: result.insertedId.toString(), username: name } });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== USER ROUTES =====
app.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    const db = await connectToDB();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (user) {
      res.json({ ...user, _id: user._id.toString() });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/users/:id/projects', async (req, res) => {
  try {
    const db = await connectToDB();
    const userId = req.params.id;
    
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    
    const projects = await db.collection('projects').find({
      $or: [
        { ownerId: new ObjectId(userId) },
        { ownerId: userId }
      ]
    }).toArray();
    
    const formattedProjects = projects.map(p => ({
      ...p,
      _id: p._id.toString(),
      ownerId: p.ownerId.toString ? p.ownerId.toString() : p.ownerId
    }));
    
    res.json(formattedProjects);
    
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const db = await connectToDB();
    const { name, contact, workConnections } = req.body;
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, contact, workConnections } }
    );
    if (result.matchedCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/users/:id/friends', async (req, res) => {
  try {
    const db = await connectToDB();
    const { friendId } = req.body;
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $addToSet: { friends: new ObjectId(friendId) } }
    );
    if (result.matchedCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== PROJECT ROUTES =====
app.post('/projects', async (req, res) => {
  try {
    const db = await connectToDB();
    const { name, description, ownerId } = req.body;
    const result = await db.collection('projects').insertOne({ 
      name, 
      description, 
      ownerId: new ObjectId(ownerId), 
      members: [new ObjectId(ownerId)], 
      checkins: [] 
    });
    res.json({ success: true, id: result.insertedId.toString() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/projects/:id', async (req, res) => {
  try {
    const db = await connectToDB();
    const projectId = req.params.id;
    
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }
    
    const project = await db.collection('projects').findOne({ 
      _id: new ObjectId(projectId) 
    });
    
    if (project) {
      res.json({ 
        ...project, 
        _id: project._id.toString(),
        ownerId: project.ownerId.toString ? project.ownerId.toString() : project.ownerId
      });
    } else {
      res.status(404).json({ success: false, message: 'Project not found' });
    }
    
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/projects/:id', async (req, res) => {
  try {
    const db = await connectToDB();
    const { name, description } = req.body;
    const result = await db.collection('projects').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, description } }
    );
    if (result.matchedCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/projects/:id/members', async (req, res) => {
  try {
    const db = await connectToDB();
    const { userId } = req.body;
    const result = await db.collection('projects').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $addToSet: { members: new ObjectId(userId) } }
    );
    if (result.matchedCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== CHECK-IN ROUTES =====
app.post('/projects/:id/checkins', async (req, res) => {
  try {
    const db = await connectToDB();
    const { userId, type, message } = req.body;
    const checkInData = { 
      projectId: new ObjectId(req.params.id), 
      userId: new ObjectId(userId), 
      type, 
      message, 
      date: new Date() 
    };
    const result = await db.collection('checkins').insertOne(checkInData);
    await db.collection('projects').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { checkins: result.insertedId } }
    );
    res.json({ success: true, id: result.insertedId.toString() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/projects/:id/checkins', async (req, res) => {
  try {
    const db = await connectToDB();
    const checkins = await db.collection('checkins').find({ projectId: new ObjectId(req.params.id) }).toArray();
    res.json(checkins.map(c => ({ ...c, _id: c._id.toString() })));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== MESSAGES ROUTES =====
app.get('/projects/:id/messages', async (req, res) => {
  try {
    const db = await connectToDB();
    const projectId = req.params.id;
    
    console.log('Fetching messages for project:', projectId);
    
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    // Get messages for this project
    const messages = await db.collection('messages')
      .find({ projectId: projectId })
      .sort({ time: -1 })
      .limit(50)
      .toArray();
    
    console.log(`Found ${messages.length} messages for project ${projectId}`);
    
    // Convert ObjectId to string for frontend
    const formattedMessages = messages.map(message => ({
      ...message,
      _id: message._id.toString(),
      id: message._id.toString() // Add id field for frontend compatibility
    }));
    
    res.json(formattedMessages);
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== FILE ROUTES =====
app.get('/projects/:id/files', async (req, res) => {
  try {
    const db = await connectToDB();
    const projectId = req.params.id;
    
    console.log('Fetching files for project:', projectId);
    
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    // Get files from files collection for this project
    const files = await db.collection('files')
      .find({ projectId: projectId })
      .toArray();
    
    console.log(`Found ${files.length} files for project ${projectId}`);
    
    // Convert ObjectId to string
    const formattedFiles = files.map(file => ({
      ...file,
      _id: file._id.toString()
    }));
    
    res.json(formattedFiles);
    
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/files/:fileId/checkout', async (req, res) => {
  try {
    const db = await connectToDB();
    const fileId = req.params.fileId;
    const { userId } = req.body;
    
    console.log(`Checking out file: ${fileId} by user: ${userId}`);
    
    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ success: false, message: 'Invalid file ID' });
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID required' });
    }

    // Check if file exists
    const file = await db.collection('files').findOne({ 
      _id: new ObjectId(fileId) 
    });
    
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Check if file is already checked out
    if (file.checkedOutBy) {
      return res.status(400).json({ 
        success: false, 
        message: `File "${file.name}" is already checked out by another user` 
      });
    }

    // Update file with checkout information
    const result = await db.collection('files').updateOne(
      { _id: new ObjectId(fileId) },
      { 
        $set: { 
          checkedOutBy: userId,
          checkedOutAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 0) {
      throw new Error('Failed to check out file');
    }

    res.json({ 
      success: true, 
      message: `File "${file.name}" checked out successfully`,
      file: {
        ...file,
        _id: file._id.toString(),
        checkedOutBy: userId,
        checkedOutAt: new Date()
      }
    });
    
  } catch (error) {
    console.error('Error checking out file:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// ===== ACTIVITY ROUTES =====
app.get('/activity/local/:userId', async (req, res) => {
  try {
    const db = await connectToDB();
    const userId = req.params.userId;
    
    console.log(`Fetching local activities for user: ${userId}`);
    
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    // Get activities for this user
    const activities = await db.collection('activities')
      .find({ userId: userId })
      .sort({ date: -1 })
      .limit(20)
      .toArray();
    
    console.log(`Found ${activities.length} activities for user ${userId}`);
    
    const formattedActivities = activities.map(activity => ({
      ...activity,
      _id: activity._id.toString()
    }));
    
    res.json(formattedActivities);
    
  } catch (error) {
    console.error('Error fetching local activities:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/activity/global', async (req, res) => {
  try {
    const db = await connectToDB();
    
    // Get all activities
    const activities = await db.collection('activities')
      .find({})
      .sort({ date: -1 })
      .limit(50)
      .toArray();
    
    console.log(`Found ${activities.length} global activities`);
    
    const formattedActivities = activities.map(activity => ({
      ...activity,
      _id: activity._id.toString()
    }));
    
    res.json(formattedActivities);
    
  } catch (error) {
    console.error('Error fetching global activities:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== ISSUES ROUTE =====
app.get('/api/projects/:id/issues', async (req, res) => {
  try {
    const db = await connectToDB();
    const projectId = req.params.id;
    
    console.log('Fetching issues for project:', projectId);
    
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    // Return empty array for now (stub)
    res.json([]);
    
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== PULL REQUESTS ROUTE =====
app.get('/api/projects/:id/pulls', async (req, res) => {
  try {
    const db = await connectToDB();
    const projectId = req.params.id;
    
    console.log('Fetching pull requests for project:', projectId);
    
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    // Return empty array for now (stub)
    res.json([]);
    
  } catch (error) {
    console.error('Error fetching pull requests:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== STATS ROUTE =====
app.get('/api/projects/:id/stats', async (req, res) => {
  try {
    const db = await connectToDB();
    const projectId = req.params.id;
    
    console.log('Fetching stats for project:', projectId);
    
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    // Get actual counts from database
    const filesCount = await db.collection('files').countDocuments({ projectId });
    const messagesCount = await db.collection('messages').countDocuments({ projectId });
    const checkinsCount = await db.collection('checkins').countDocuments({ projectId: new ObjectId(projectId) });
    
    // Get unique contributors (users who created messages or checkins)
    const messageContributors = await db.collection('messages').distinct('userId', { projectId });
    const checkinContributors = await db.collection('checkins').distinct('userId', { projectId: new ObjectId(projectId) });
    const uniqueContributors = new Set([...messageContributors, ...checkinContributors.map(id => id.toString())]);

    res.json({
      files: filesCount,
      contributors: uniqueContributors.size,
      checkins: checkinsCount,
      messages: messagesCount,
      issues: 0, // You can add issues collection later
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== VERSION HISTORY =====
app.get('/projects/:id/versions', async (req, res) => {
  try {
    res.json(['v1.0 - 2025-09-03', 'v0.9 - 2025-09-02']);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== DEBUG ROUTES =====
app.get('/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    }
  });
  res.json(routes);
});

app.listen(port, async () => {
  try {
    await connectToDB();
    console.log(`Server running on port ${port}`);
    console.log('Available routes:');
    console.log('- GET /users/:id');
    console.log('- GET /users/:id/projects');
    console.log('- GET /projects/:id');
    console.log('- GET /projects/:id/messages');
    console.log('- GET /projects/:id/files');
    console.log('- GET /projects/:id/issues');
    console.log('- GET /projects/:id/pulls');
    console.log('- GET /projects/:id/stats');
    console.log('- GET /activity/local/:userId');
    console.log('- GET /activity/global');
  } catch (error) {
    console.error('Failed to start server:', error);
  }
});

// Add these routes to your server.js (with /api prefix)

// ===== ISSUES ROUTE WITH /api =====
app.get('/api/projects/:id/issues', async (req, res) => {
  try {
    const db = await connectToDB();
    const projectId = req.params.id;
    
    console.log('Fetching issues for project:', projectId);
    
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    // Return empty array for now (stub)
    res.json([]);
    
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== PULL REQUESTS ROUTE WITH /api =====
app.get('/api/projects/:id/pulls', async (req, res) => {
  try {
    const db = await connectToDB();
    const projectId = req.params.id;
    
    console.log('Fetching pull requests for project:', projectId);
    
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    // Return empty array for now (stub)
    res.json([]);
    
  } catch (error) {
    console.error('Error fetching pull requests:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== STATS ROUTE WITH /api =====
app.get('/api/projects/:id/stats', async (req, res) => {
  try {
    const db = await connectToDB();
    const projectId = req.params.id;
    
    console.log('Fetching stats for project:', projectId);
    
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    // Get actual counts from database
    const filesCount = await db.collection('files').countDocuments({ projectId });
    const messagesCount = await db.collection('messages').countDocuments({ projectId });
    const checkinsCount = await db.collection('checkins').countDocuments({ projectId: new ObjectId(projectId) });
    
    // Get unique contributors (users who created messages or checkins)
    const messageContributors = await db.collection('messages').distinct('userId', { projectId });
    const checkinContributors = await db.collection('checkins').distinct('userId', { projectId: new ObjectId(projectId) });
    const uniqueContributors = new Set([...messageContributors, ...checkinContributors.map(id => id.toString())]);

    res.json({
      files: filesCount,
      contributors: uniqueContributors.size,
      checkins: checkinsCount,
      messages: messagesCount,
      issues: 0,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await client.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});