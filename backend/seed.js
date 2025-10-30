// seed.js - Temporary script to delete existing data and inject new fitting data
// (includes the test user & demo project required by the PDF)

const { MongoClient, ObjectId } = require('mongodb');
require("dotenv").config();

const uri = process.env.MONGO_URI;
const dbName = 'version-control-db';

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    // --------------------------------------------------------------
    // 1. Wipe everything clean
    // --------------------------------------------------------------
    const collections = [
      'activities', 'checkIns', 'files', 'issues', 'messages',
      'projects', 'pullRequests', 'users', 'versions'
    ];
    for (const col of collections) {
      await db.collection(col).deleteMany({});
    }
    console.log('All existing data deleted.');

    // --------------------------------------------------------------
    // 2. Insert 12 regular users + 1 required test user = 13 users
    // --------------------------------------------------------------
    const userData = [
      // ----- TEST USER (required by the PDF) -----
      {
        username: 'testuser',
        password: 'test123',
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: false,
        profileImage: '/profiles/testuser.png',
        friends: [],
        savedProjects: [],
        createdAt: new Date('2025-09-01'),
        contact: 'test@example.com',
        workConnections: 'Demo Account for IMY 220'
      },

      // ----- 12 regular users (admin + 11 normal) -----
      {
        username: 'admin',
        password: 'admin',
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true,
        profileImage: '/profiles/admin.png',
        friends: [],
        savedProjects: [],
        createdAt: new Date('2025-09-01'),
        contact: 'admin@example.com',
        workConnections: 'Admin Team'
      },
      {
        username: 'alice',
        password: 'password',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        isAdmin: false,
        profileImage: '/profiles/alice.png',
        friends: [],
        savedProjects: [],
        createdAt: new Date('2025-09-02'),
        contact: 'alice@example.com',
        workConnections: 'Software Developer at TechCorp'
      },
      {
        username: 'bob',
        password: 'password',
        name: 'Bob Smith',
        email: 'bob@example.com',
        isAdmin: false,
        profileImage: '/profiles/bob.png',
        friends: [],
        savedProjects: [],
        createdAt: new Date('2025-09-03'),
        contact: 'bob@example.com',
        workConnections: 'Frontend Engineer at WebSolutions'
      },
      {
        username: 'charlie',
        password: 'password',
        name: 'Charlie Davis',
        email: 'charlie@example.com',
        isAdmin: false,
        profileImage: '/profiles/charlie.png',
        friends: [],
        savedProjects: [],
        createdAt: new Date('2025-09-04'),
        contact: 'charlie@example.com',
        workConnections: 'Backend Developer at DataInc'
      },
      {
        username: 'david',
        password: 'password',
        name: 'David Evans',
        email: 'david@example.com',
        isAdmin: false,
        profileImage: '/profiles/david.png',
        friends: [],
        savedProjects: [],
        createdAt: new Date('2025-09-05'),
        contact: 'david@example.com',
        workConnections: 'Full Stack Developer at Innovate Ltd'
      },
      {
        username: 'eve',
        password: 'password',
        name: 'Eve Frank',
        email: 'eve@example.com',
        isAdmin: false,
        profileImage: '/profiles/eve.png',
        friends: [],
        savedProjects: [],
        createdAt: new Date('2025-09-06'),
        contact: 'eve@example.com',
        workConnections: 'UI/UX Designer at DesignHub'
      },
      {
        username: 'frank',
        password: 'password',
        name: 'Frank Green',
        email: 'frank@example.com',
        isAdmin: false,
        profileImage: '/profiles/frank.png',
        friends: [],
        savedProjects: [],
        createdAt: new Date('2025-09-07'),
        contact: 'frank@example.com',
        workConnections: 'DevOps Engineer at CloudServices'
      },
      {
        username: 'grace',
        password: 'password',
        name: 'Grace Harris',
        email: 'grace@example.com',
        isAdmin: false,
        profileImage: '/profiles/grace.png',
        friends: [],
        savedProjects: [],
        createdAt: new Date('2025-09-08'),
        contact: 'grace@example.com',
        workConnections: 'Project Manager at SoftWare Co'
      },
      {
        username: 'hank',
        password: 'password',
        name: 'Hank Iris',
        email: 'hank@example.com',
        isAdmin: false,
        profileImage: '/profiles/hank.png',
        friends: [],
        savedProjects: [],
        createdAt: new Date('2025-09-09'),
        contact: 'hank@example.com',
        workConnections: 'QA Tester at QualityAssure'
      },
      {
        username: 'ivy',
        password: 'password',
        name: 'Ivy Jones',
        email: 'ivy@example.com',
        isAdmin: false,
        profileImage: '/profiles/ivy.png',
        friends: [],
        savedProjects: [],
        createdAt: new Date('2025-09-10'),
        contact: 'ivy@example.com',
        workConnections: 'Data Scientist at AnalyticsFirm'
      },
      {
        username: 'jack',
        password: 'password',
        name: 'Jack King',
        email: 'jack@example.com',
        isAdmin: false,
        profileImage: '/profiles/jack.png',
        friends: [],
        savedProjects: [],
        createdAt: new Date('2025-09-11'),
        contact: 'jack@example.com',
        workConnections: 'Mobile Developer at AppWorld'
      },
      {
        username: 'kathy',
        password: 'password',
        name: 'Kathy Lee',
        email: 'kathy@example.com',
        isAdmin: false,
        profileImage: '/profiles/kathy.png',
        friends: [],
        savedProjects: [],
        createdAt: new Date('2025-09-12'),
        contact: 'kathy@example.com',
        workConnections: 'Security Specialist at SecureNet'
      }
    ];

    const usersResult = await db.collection('users').insertMany(userData);
    const userIds = Object.values(usersResult.insertedIds).map(id => id.toString());

    // --------------------------------------------------------------
    // 3. Friend relationships (same as before)
    // --------------------------------------------------------------
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[1] }, { $set: { friends: [userIds[2], userIds[3], userIds[4], userIds[5], userIds[6]] } });
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[2] }, { $set: { friends: [userIds[1], userIds[3], userIds[4]] } });
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[3] }, { $set: { friends: [userIds[1], userIds[2], userIds[5]] } });
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[4] }, { $set: { friends: [userIds[1], userIds[2], userIds[6]] } });
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[5] }, { $set: { friends: [userIds[1], userIds[3], userIds[7]] } });
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[6] }, { $set: { friends: [userIds[1], userIds[4], userIds[8]] } });
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[7] }, { $set: { friends: [userIds[5], userIds[9], userIds[10]] } });
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[8] }, { $set: { friends: [userIds[6], userIds[9], userIds[11]] } });
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[9] }, { $set: { friends: [userIds[7], userIds[8], userIds[12]] } });
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[10] }, { $set: { friends: [userIds[7], userIds[9]] } });
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[11] }, { $set: { friends: [userIds[8], userIds[9]] } });
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[12] }, { $set: { friends: [userIds[8], userIds[9]] } });

    // --------------------------------------------------------------
    // 4. 12 regular projects + 1 required DEMO project = 13 projects
    // --------------------------------------------------------------
    const projectData = [
      // ----- REQUIRED DEMO PROJECT (PDF) -----
      {
        name: 'Demo Version Control Project',
        description: 'A fully-featured demo project to showcase every feature of the platform. Everyone can join, check-out files, and contribute.',
        hashtags: ['demo', 'version-control', 'showcase', 'tutorial'],
        image: '/projects/demo.png',
        ownerId: userIds[0], // testuser is the owner
        members: userIds.slice(0, 13), // **ALL** users are members
        createdAt: new Date('2025-09-13'),
        type: 'web',
        version: '1.0.0',
        checkins: []
      },

      // ----- 12 regular projects (unchanged) -----
      {
        name: 'WebApp Tracker',
        description: 'A web application for tracking issues and versions in software development.',
        hashtags: ['web', 'tracking', 'js'],
        image: '/projects/webapp.png',
        ownerId: userIds[2], // alice
        members: [userIds[2], userIds[3], userIds[4]],
        createdAt: new Date('2025-09-15'),
        type: 'web',
        version: '1.0.0',
        checkins: []
      },
      {
        name: 'Mobile Inventory System',
        description: 'Mobile app for managing inventory in warehouses.',
        hashtags: ['mobile', 'inventory', 'reactnative'],
        image: '/projects/mobileinv.png',
        ownerId: userIds[3], // bob
        members: [userIds[3], userIds[5]],
        createdAt: new Date('2025-09-16'),
        type: 'mobile',
        version: '0.9.0',
        checkins: []
      },
      {
        name: 'Data Analytics Dashboard',
        description: 'Dashboard for visualizing business data analytics.',
        hashtags: ['data', 'analytics', 'python'],
        image: '/projects/dashboard.png',
        ownerId: userIds[4], // charlie
        members: [userIds[4], userIds[6], userIds[7]],
        createdAt: new Date('2025-09-17'),
        type: 'web',
        version: '1.1.0',
        checkins: []
      },
      {
        name: 'E-commerce Platform',
        description: 'Online shopping platform with user authentication and payments.',
        hashtags: ['ecommerce', 'shopping', 'node'],
        image: '/projects/ecommerce.png',
        ownerId: userIds[5], // david
        members: [userIds[5], userIds[2]],
        createdAt: new Date('2025-09-18'),
        type: 'web',
        version: '2.0.0',
        checkins: []
      },
      {
        name: 'Fitness Tracking App',
        description: 'App to track fitness activities and health metrics.',
        hashtags: ['fitness', 'health', 'mobile'],
        image: '/projects/fitness.png',
        ownerId: userIds[6], // eve
        members: [userIds[6], userIds[8]],
        createdAt: new Date('2025-09-19'),
        type: 'mobile',
        version: '1.0.1',
        checkins: []
      },
      {
        name: 'Blogging Site',
        description: 'Platform for creating and sharing blog posts.',
        hashtags: ['blog', 'content', 'cms'],
        image: '/projects/blog.png',
        ownerId: userIds[7], // frank
        members: [userIds[7], userIds[9], userIds[10]],
        createdAt: new Date('2025-09-20'),
        type: 'web',
        version: '1.5.0',
        checkins: []
      },
      {
        name: 'Task Management Tool',
        description: 'Tool for managing tasks and team collaboration.',
        hashtags: ['tasks', 'management', 'team'],
        image: '/projects/tasktool.png',
        ownerId: userIds[8], // grace
        members: [userIds[8], userIds[11]],
        createdAt: new Date('2025-09-21'),
        type: 'web',
        version: '1.2.0',
        checkins: []
      },
      {
        name: 'Weather Forecasting App',
        description: 'App providing weather forecasts and alerts.',
        hashtags: ['weather', 'forecast', 'api'],
        image: '/projects/weather.png',
        ownerId: userIds[9], // hank
        members: [userIds[9], userIds[12]],
        createdAt: new Date('2025-09-22'),
        type: 'mobile',
        version: '0.8.0',
        checkins: []
      },
      {
        name: 'Recipe Sharing Site',
        description: 'Website for sharing and discovering recipes.',
        hashtags: ['recipes', 'food', 'sharing'],
        image: '/projects/recipes.png',
        ownerId: userIds[10], // ivy
        members: [userIds[10], userIds[7]],
        createdAt: new Date('2025-09-23'),
        type: 'web',
        version: '1.3.0',
        checkins: []
      },
      {
        name: 'Online Learning Platform',
        description: 'Platform for online courses and learning materials.',
        hashtags: ['learning', 'education', 'online'],
        image: '/projects/learning.png',
        ownerId: userIds[11], // jack
        members: [userIds[11], userIds[8], userIds[9]],
        createdAt: new Date('2025-09-24'),
        type: 'web',
        version: '2.1.0',
        checkins: []
      },
      {
        name: 'Social Network Prototype',
        description: 'Prototype for a social networking site.',
        hashtags: ['social', 'network', 'prototype'],
        image: '/projects/social.png',
        ownerId: userIds[12], // kathy
        members: [userIds[12], userIds[10]],
        createdAt: new Date('2025-09-25'),
        type: 'web',
        version: '0.5.0',
        checkins: []
      },
      {
        name: 'Inventory Management System',
        description: 'System for managing stock and orders.',
        hashtags: ['inventory', 'management', 'system'],
        image: '/projects/inventory.png',
        ownerId: userIds[2], // alice again
        members: [userIds[2], userIds[3]],
        createdAt: new Date('2025-09-26'),
        type: 'web',
        version: '1.4.0',
        checkins: []
      }
    ];

    const projectsResult = await db.collection('projects').insertMany(projectData);
    const projectIds = Object.values(projectsResult.insertedIds).map(id => id.toString());

    // --------------------------------------------------------------
    // 5. Saved projects (some users save a few projects)
    // --------------------------------------------------------------
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[2] }, { $set: { savedProjects: [projectIds[1], projectIds[2]] } });
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[3] }, { $set: { savedProjects: [projectIds[0], projectIds[3]] } });
    await db.collection('users').updateOne({ _id: usersResult.insertedIds[4] }, { $set: { savedProjects: [projectIds[4], projectIds[5]] } });

    // --------------------------------------------------------------
    // 6. Per-project data (files, check-ins, activities, etc.)
    // --------------------------------------------------------------
    for (let i = 0; i < projectIds.length; i++) {
      const pid = projectIds[i];
      const ownerId = projectData[i].ownerId;
      const memberIds = projectData[i].members;

      // ---- Files (3 per project) ----
      await db.collection('files').insertMany([
        {
          projectId: pid,
          name: 'index.js',
          content: `console.log("Hello from ${projectData[i].name}");`,
          checkedOutBy: null,
          checkedOutAt: null
        },
        {
          projectId: pid,
          name: 'styles.css',
          content: 'body { background:#fafafa; font-family:Arial; }',
          checkedOutBy: i % 3 === 0 ? memberIds[0] : null,
          checkedOutAt: i % 3 === 0 ? new Date() : null
        },
        {
          projectId: pid,
          name: 'README.md',
          content: `# ${projectData[i].name}\n${projectData[i].description}`,
          checkedOutBy: null,
          checkedOutAt: null
        }
      ]);

      // ---- Check-ins ----
      await db.collection('checkIns').insertMany([
        {
          projectId: pid,
          userId: ownerId,
          type: 'check-in',
          message: 'Initial commit – project scaffold',
          date: projectData[i].createdAt,
          updatedFiles: ['index.js', 'styles.css', 'README.md']
        },
        {
          projectId: pid,
          userId: memberIds[1 % memberIds.length],
          type: 'update',
          message: 'Minor UI tweak and bug fix',
          date: new Date(projectData[i].createdAt.getTime() + 86400000),
          updatedFiles: ['styles.css']
        }
      ]);

      // ---- Activities ----
      await db.collection('activities').insertMany([
        {
          userId: ownerId,
          type: 'Created Project',
          projectId: pid,
          date: projectData[i].createdAt
        },
        {
          userId: memberIds[1 % memberIds.length],
          type: 'Updated File',
          projectId: pid,
          date: new Date(projectData[i].createdAt.getTime() + 86400000)
        }
      ]);

      // ---- Issues ----
      await db.collection('issues').insertMany([
        { projectId: pid, description: 'Add user authentication' },
        { projectId: pid, description: 'Improve mobile responsiveness' }
      ]);

      // ---- Messages (discussion board) ----
      await db.collection('messages').insertMany([
        {
          projectId: pid,
          text: 'Welcome! Let’s get started.',
          time: projectData[i].createdAt,
          userId: ownerId
        },
        {
          projectId: pid,
          text: 'I have a design mock-up ready.',
          time: new Date(projectData[i].createdAt.getTime() + 3600000),
          userId: memberIds[1 % memberIds.length]
        }
      ]);

      // ---- Pull Requests ----
      await db.collection('pullRequests').insertOne({
        projectId: pid,
        title: 'Feature: Dark mode toggle'
      });

      // ---- Versions (bonus) ----
      await db.collection('versions').insertMany([
        { projectId: pid, version: `v${projectData[i].version}`, date: projectData[i].createdAt },
        { projectId: pid, version: `v${(parseFloat(projectData[i].version) + 0.1).toFixed(1)}`, date: new Date(projectData[i].createdAt.getTime() + 172800000) }
      ]);
    }

    console.log('New data injected successfully (13 users, 13 projects, demo data included).');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.close();
  }
}

seed();