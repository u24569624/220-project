// server.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const dbFunctions = require('./db'); // Your existing db functions
require("dotenv").config();

const app = express();
app.use(express.json());

// MongoDB Configuration
const uri = process.env.MONGO_URI; // Update if using a different host/port or authentication
const dbName = 'version-control-db'; // Match the database name used in seed.js

let db;

async function connectToDB() {
  if (!db) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      await client.connect();
      console.log('Connected to MongoDB at', uri);
      db = client.db(dbName);
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error.message);
      process.exit(1); // Exit on connection failure
    }
  }
  return db;
}

// API Endpoints

// Get user by ID
app.get('/api/users/:userId', async (req, res) => {
  try {
    const db = await connectToDB();
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.userId) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get projects for a user
app.get('/api/users/:userId/projects', async (req, res) => {
  try {
    const db = await connectToDB();
    const projects = await db.collection('projects').find({ ownerId: req.params.userId }).toArray();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get local activities for a user
app.get('/api/activity/local/:userId', async (req, res) => {
  try {
    const db = await connectToDB();
    const activities = await db.collection('activities').find({ userId: req.params.userId }).toArray();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project details by ID
app.get('/api/projects/:projectId', async (req, res) => {
  try {
    const db = await connectToDB();
    const project = await db.collection('projects').findOne({ _id: new ObjectId(req.params.projectId) });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get files for a project
app.get('/api/projects/:projectId/files', async (req, res) => {
  try {
    const db = await connectToDB();
    const files = await db.collection('files').find({ projectId: req.params.projectId }).toArray();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get issues for a project
app.get('/api/projects/:projectId/issues', async (req, res) => {
  try {
    const db = await connectToDB();
    const issues = await db.collection('issues').find({ projectId: req.params.projectId }).toArray();
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a project
app.get('/api/projects/:projectId/messages', async (req, res) => {
  try {
    const db = await connectToDB();
    const messages = await db.collection('messages').find({ projectId: req.params.projectId }).toArray();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pull requests for a project
app.get('/api/projects/:projectId/pulls', async (req, res) => {
  try {
    const db = await connectToDB();
    const pulls = await db.collection('pullRequests').find({ projectId: req.params.projectId }).toArray();
    res.json(pulls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get versions for a project
app.get('/api/projects/:projectId/versions', async (req, res) => {
  try {
    const db = await connectToDB();
    const versions = await db.collection('versions').find({ projectId: req.params.projectId }).toArray();
    res.json(versions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check out a file (example POST endpoint)
app.post('/api/projects/:projectId/files/:fileName', async (req, res) => {
  try {
    const db = await connectToDB();
    const { userId } = req.body; // Assume userId is sent in the request body
    if (!userId) return res.status(400).json({ error: 'User ID is required' });
    await db.collection('files').updateOne(
      { projectId: req.params.projectId, name: req.params.fileName },
      { $set: { checkedOutBy: userId } }
    );
    res.json({ message: `Checked out ${req.params.fileName}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send friend request (example POST endpoint)
app.post('/api/users/:targetId/friends', async (req, res) => {
  try {
    const db = await connectToDB();
    const { userId } = req.body; // Assume userId is sent in the request body
    if (!userId) return res.status(400).json({ error: 'User ID is required' });
    await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.targetId) },
      { $push: { friends: userId } }
    );
    res.json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, async () => {
  await connectToDB(); // Ensure DB connection on startup
  console.log(`Server running on port ${PORT}`);
});