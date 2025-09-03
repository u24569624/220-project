const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// Handle client-side routing (e.g., /profile/:id)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Stub endpoints (as before)
app.post('/api/auth/signin', (req, res) => {
  res.json({ success: true, token: 'dummy_token', user: { id: 1, name: 'Dummy User' } });
});

app.post('/api/auth/signup', (req, res) => {
  res.json({ success: true, message: 'User created', user: req.body });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});