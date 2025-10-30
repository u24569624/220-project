const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const app = express();
const port = 5000;
require("dotenv").config();

app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../dist')));

// MongoDB Connection
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI is not defined in environment variables');
  console.error('Please check your .env file');
  process.exit(1);
}

let db;
let client;

async function connectToDB() {
  try {
    if (!db) {
      console.log('Connecting to MongoDB...');
      client = new MongoClient(uri);
      await client.connect();
      db = client.db();
      console.log('Connected to MongoDB successfully');
    }
    return db;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

// ===== API AUTHENTICATION ROUTES =====
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await connectToDB();
    
    console.log('API Signin attempt for:', username);
    
    const user = await db.collection('users').findOne({ 
      $or: [
        { username: username },
        { email: username }
      ]
    });
    
    if (user && user.password === password) {
      console.log('API Signin successful for user:', user.username || user.email);
      res.json({ 
        success: true, 
        user: { 
          id: user._id.toString(), 
          username: user.username || user.email,
          name: user.name || user.username || user.email
        } 
      });
    } else {
      console.log('API Signin failed: Invalid credentials');
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('API Signin error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const db = await connectToDB();
    
    console.log('API Signup attempt for:', email);
    
    const existingUser = await db.collection('users').findOne({ 
      $or: [
        { email: email },
        { username: email }
      ]
    });
    
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already registered' });
    } else {
      const userData = {
        email,
        password,
        name: name || email.split('@')[0],
        username: email,
        friends: [],
        workConnections: '',
        projects: [],
        createdAt: new Date()
      };
      
      const result = await db.collection('users').insertOne(userData);
      
      res.json({ 
        success: true, 
        user: { 
          id: result.insertedId.toString(), 
          username: userData.username,
          name: userData.name
        } 
      });
    }
  } catch (error) {
    console.error('API Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ===== USER ROUTES =====
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const db = await connectToDB();
    
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    
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

app.get('/api/users/:id/projects', async (req, res) => {
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

app.put('/api/users/:id', async (req, res) => {
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

app.post('/api/users/:id/friends', async (req, res) => {
  try {
    const db = await connectToDB();
    const { friendId } = req.body;
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $addToSet: { friends: new ObjectId(friendId) } }// Add to array, avoid duplicates
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
app.post('/api/projects', async (req, res) => {
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

app.get('/api/projects/:id', async (req, res) => {
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

app.put('/api/projects/:id', async (req, res) => {
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

// ===== CHECK-IN ROUTES =====
app.post('/api/projects/:id/checkins', async (req, res) => {
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

app.get('/api/projects/:id/checkins', async (req, res) => {
  try {
    const db = await connectToDB();
    const checkins = await db.collection('checkins').find({ projectId: new ObjectId(req.params.id) }).toArray();
    res.json(checkins.map(c => ({ ...c, _id: c._id.toString() })));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== MESSAGES ROUTES =====
app.get('/api/projects/:id/messages', async (req, res) => {
  try {
    const db = await connectToDB();
    const projectId = req.params.id;
    
    console.log('Fetching messages for project:', projectId);
    
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    const messages = await db.collection('messages')
      .find({ projectId: projectId })
      .sort({ time: -1 })
      .limit(50)
      .toArray();
    
    console.log(`Found ${messages.length} messages for project ${projectId}`);
    
    const formattedMessages = messages.map(message => ({
      ...message,
      _id: message._id.toString(),
      id: message._id.toString()
    }));
    
    res.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== FILE ROUTES =====
app.get('/api/projects/:id/files', async (req, res) => {
  try {
    const db = await connectToDB();
    const projectId = req.params.id;
    
    console.log('Fetching files for project:', projectId);
    
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    const files = await db.collection('files')
      .find({ projectId: projectId })
      .toArray();
    
    console.log(`Found ${files.length} files for project ${projectId}`);
    
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

app.post('/api/files/:fileId/checkout', async (req, res) => {
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

    const file = await db.collection('files').findOne({ 
      _id: new ObjectId(fileId) 
    });
    
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    if (file.checkedOutBy) {
      return res.status(400).json({ 
        success: false, 
        message: `File "${file.name}" is already checked out by another user` 
      });
    }

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
app.get('/api/activity/local/:userId', async (req, res) => {
  try {
    const db = await connectToDB();
    const userId = req.params.userId;
    
    console.log(`Fetching local activities for user: ${userId}`);
    
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

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

app.get('/api/activity/global', async (req, res) => {
  try {
    const db = await connectToDB();
    
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

// ===== OTHER ROUTES =====
app.get('/api/projects/:id/versions', async (req, res) => {
  try {
    res.json(['v1.0 - 2025-09-03', 'v0.9 - 2025-09-02']);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/projects/:id/issues', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/projects/:id/pulls', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/projects/:id/stats', async (req, res) => {
  try {
    res.json({
      files: 12,
      contributors: 3,
      checkins: 8,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== DELETE PROJECT ROUTE =====
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const db = await connectToDB();
    const projectId = req.params.id;
    
    console.log('Attempting to delete project:', projectId);
    
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    // First, check if the project exists
    const project = await db.collection('projects').findOne({ 
      _id: new ObjectId(projectId) 
    });
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Verify the user is the owner (you can add this check for security)
    const userId = req.headers['user-id'] || req.body.userId; // You might want to send this from frontend
    if (userId && project.ownerId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Only project owner can delete the project' });
    }

    // Delete the project
    const result = await db.collection('projects').deleteOne({ 
      _id: new ObjectId(projectId) 
    });

    if (result.deletedCount === 1) {
      console.log('Project deleted successfully:', projectId);
      
      // Optional: Also delete related data (files, messages, checkins, etc.)
      try {
        // Delete related files
        await db.collection('files').deleteMany({ projectId: projectId });
        
        // Delete related messages
        await db.collection('messages').deleteMany({ projectId: projectId });
        
        // Delete related checkins
        await db.collection('checkins').deleteMany({ projectId: new ObjectId(projectId) });
        
        // Delete related activities
        await db.collection('activities').deleteMany({ projectId: projectId });
        
        console.log('Cleaned up related data for project:', projectId);
      } catch (cleanupError) {
        console.warn('Some cleanup operations failed, but project was deleted:', cleanupError);
      }
      
      res.json({ 
        success: true, 
        message: 'Project deleted successfully' 
      });
    } else {
      console.log('Project not found for deletion:', projectId);
      res.status(404).json({ success: false, message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// ===== FILE DOWNLOAD ROUTE =====
app.get('/api/files/:fileId/download', async (req, res) => {
  try {
    const db = await connectToDB();
    const fileId = req.params.fileId;
    
    console.log('Download request for file:', fileId);
    
    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ success: false, message: 'Invalid file ID' });
    }

    const file = await db.collection('files').findOne({ 
      _id: new ObjectId(fileId) 
    });
    
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // If file has content stored (for text files)
    if (file.content) {
      res.setHeader('Content-Type', file.mimeType || 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
      res.send(file.content);
    } 
    // If file has a URL (for stored files)
    else if (file.url) {
      res.redirect(file.url);
    }
    // Fallback: create a simple file with file info
    else {
      const fileContent = `File: ${file.name}\nProject: ${file.projectId}\nCreated: ${file.createdAt || new Date().toISOString()}\n\nThis is a placeholder file. In a full implementation, actual file content would be here.`;
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${file.name}.txt"`);
      res.send(fileContent);
    }
    
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// ===== GET FILE INFO ROUTE =====
app.get('/api/files/:fileId', async (req, res) => {
  try {
    const db = await connectToDB();
    const fileId = req.params.fileId;
    
    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ success: false, message: 'Invalid file ID' });
    }

    const file = await db.collection('files').findOne({ 
      _id: new ObjectId(fileId) 
    });
    
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    res.json({
      ...file,
      _id: file._id.toString()
    });
    
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// ===== DEBUG ROUTES =====
app.get('/api/debug/routes', (req, res) => {
  const routes = [
    '/api/search',
    '/api/search/users', 
    '/api/users/:id',
    '/api/projects/:id',
    '/api/auth/signin',
    '/api/auth/signup'
  ];
  res.json({ 
    message: 'Server is running',
    availableRoutes: routes,
    timestamp: new Date().toISOString()
  });
});

// Test if search route exists
app.get('/api/debug/search-test', async (req, res) => {
  try {
    const db = await connectToDB();
    const users = await db.collection('users').find({}).limit(5).toArray();
    res.json({
      message: 'Search test route works',
      userCount: users.length,
      sampleUsers: users.map(u => ({
        id: u._id.toString(),
        name: u.name,
        username: u.username,
        email: u.email
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== FRIEND MANAGEMENT ROUTES =====

// Send friend request
app.post('/api/users/:id/friend-request', async (req, res) => {
  try {
    const db = await connectToDB();
    const { targetUserId } = req.body;
    const userId = req.params.id;

    // Check if users exist
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const targetUser = await db.collection('users').findOne({ _id: new ObjectId(targetUserId) });

    if (!user || !targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if already friends
    if (user.friends && user.friends.includes(targetUserId)) {
      return res.status(400).json({ success: false, message: 'Already friends' });
    }

    // Add to pending requests (you might want a separate collection for this)
    await db.collection('users').updateOne(
      { _id: new ObjectId(targetUserId) },
      { $addToSet: { friendRequests: userId } }
    );

    res.json({ success: true, message: 'Friend request sent' });
  } catch (error) {
    console.error('Friend request error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Remove friend
app.delete('/api/users/:id/friends', async (req, res) => {
  try {
    const db = await connectToDB();
    const { friendId } = req.body;
    const userId = req.params.id;

    // Remove friend from both users
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { friends: new ObjectId(friendId) } }
    );

    await db.collection('users').updateOne(
      { _id: new ObjectId(friendId) },
      { $pull: { friends: new ObjectId(userId) } }
    );

    res.json({ success: true, message: 'Friend removed' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get friend requests
app.get('/api/users/:id/friend-requests', async (req, res) => {
  try {
    const db = await connectToDB();
    const userId = req.params.id;

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    
    if (!user || !user.friendRequests) {
      return res.json([]);
    }

    // Get details of users who sent requests
    const requestPromises = user.friendRequests.map(requestId =>
      db.collection('users').findOne({ _id: new ObjectId(requestId) })
    );
    const requests = await Promise.all(requestPromises);

    res.json(requests.filter(req => req !== null));
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== CATCH-ALL ROUTE (MUST BE LAST) =====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
async function startServer() {
  try {
    await connectToDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Frontend: http://localhost:${port}`);
      console.log(`API: http://localhost:${port}/api/...`);
      console.log('All routes are prefixed with /api');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (client) await client.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  if (client) await client.close();
  process.exit(0);
});