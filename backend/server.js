const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 5000;

app.use(express.json());

// MongoDB Connection
const uri = 'mongodb+srv://test-user:test-password@cluster0.0jkb15d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 
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

// Authentication Routes (Adjusted for proxy rewrite)
app.post('/auth/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await connectToDB();
    const user = await db.collection('users').findOne({ username, password }); // Use hashing in production
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

// User Routes
app.get('/users/:id', async (req, res) => {
  try {
    const db = await connectToDB();
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (user) {
      res.json({ ...user, _id: user._id.toString(), friends: user.friends || [], projects: user.projects || [] });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    if (error.name === 'BSONTypeError') {
      res.status(400).json({ success: false, message: 'Invalid user ID format' });
    } else {
      console.error('User fetch error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
});

app.get('/users/:id/projects', async (req, res) => {
  try {
    const db = await connectToDB();
    const projects = await db.collection('projects').find({ ownerId: new ObjectId(req.params.id) }).toArray();
    res.json(projects.map(p => ({ ...p, _id: p._id.toString() })));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const db = await connectToDB();
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (user) {
      res.json({ ...user, _id: user._id.toString(), friends: user.friends || [], projects: user.projects || [] });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    if (error.name === 'BSONTypeError') {
      res.status(400).json({ success: false, message: 'Invalid user ID format' });
    } else {
      console.error('User fetch error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
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

// Project Routes
app.post('/projects', async (req, res) => {
  try {
    const db = await connectToDB();
    const { name, description, ownerId } = req.body;
    const result = await db.collection('projects').insertOne({ name, description, ownerId: new ObjectId(ownerId), members: [new ObjectId(ownerId)], checkins: [] });
    res.json({ success: true, id: result.insertedId.toString() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/projects/:id', async (req, res) => {
  try {
    const db = await connectToDB();
    const project = await db.collection('projects').findOne({ _id: new ObjectId(req.params.id) });
    if (project) {
      res.json({ ...project, _id: project._id.toString() });
    } else {
      res.status(404).json({ success: false, message: 'Project not found' });
    }
  } catch (error) {
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

// Check-in Routes
app.post('/projects/:id/checkins', async (req, res) => {
  try {
    const db = await connectToDB();
    const { userId, type, message } = req.body;
    const checkInData = { projectId: new ObjectId(req.params.id), userId: new ObjectId(userId), type, message, date: new Date() };
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

// Version History (Stubbed)
app.get('/projects/:id/versions', async (req, res) => {
  try {
    res.json(['v1.0 - 2025-09-03', 'v0.9 - 2025-09-02']);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add to server.js
app.get('/api/activity/local/:id', async (req, res) => {
  try {
    const db = await connectToDB();
    // Placeholder: Return some sample activity data
    const activities = await db.collection('checkins').find({ userId: new ObjectId(req.params.id) }).toArray();
    res.json(activities.map(a => ({ ...a, _id: a._id.toString(), type: 'check-in', date: a.date.toISOString() })));
  } catch (error) {
    console.error('Activity fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(port, async () => {
  try {
    await connectToDB();
    console.log(`Server running on port ${port}`);
  } catch (error) {
    console.error('Failed to start server:', error);
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