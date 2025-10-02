// db.js
const { MongoClient, ObjectId } = require('mongodb');
require("dotenv").config();

const uri = process.env.MONGO_URI; 
const dbName = 'version-control-db'; 

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
      throw error; // Re-throw to be handled by calling function
    }
  }
  return db;
}

// Existing methods (based on your seed.js)
async function createUser(userData) {
  const db = await connectToDB();
  const result = await db.collection('users').insertOne(userData);
  return result.insertedId.toString();
}

async function addFriend(userId, friendId) {
  const db = await connectToDB();
  await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $push: { friends: friendId } });
}

async function createProject(projectData) {
  const db = await connectToDB();
  const result = await db.collection('projects').insertOne(projectData);
  return result.insertedId.toString();
}

async function createCheckIn(checkInData) {
  const db = await connectToDB();
  const result = await db.collection('checkIns').insertOne(checkInData);
  return result.insertedId.toString();
}

// New methods for updated seed.js
async function createActivity(activityData) {
  const db = await connectToDB();
  const result = await db.collection('activities').insertOne(activityData);
  return result.insertedId.toString();
}

async function createFile(fileData) {
  const db = await connectToDB();
  const result = await db.collection('files').insertOne(fileData);
  return result.insertedId.toString();
}

async function createIssue(issueData) {
  const db = await connectToDB();
  const result = await db.collection('issues').insertOne(issueData);
  return result.insertedId.toString();
}

async function createMessage(messageData) {
  const db = await connectToDB();
  const result = await db.collection('messages').insertOne(messageData);
  return result.insertedId.toString();
}

async function createPullRequest(pullRequestData) {
  const db = await connectToDB();
  const result = await db.collection('pullRequests').insertOne(pullRequestData);
  return result.insertedId.toString();
}

async function createVersion(versionData) {
  const db = await connectToDB();
  const result = await db.collection('versions').insertOne(versionData);
  return result.insertedId.toString();
}

// Export all functions
module.exports = {
  createUser,
  addFriend,
  createProject,
  createCheckIn,
  createActivity,
  createFile,
  createIssue,
  createMessage,
  createPullRequest,
  createVersion,
};