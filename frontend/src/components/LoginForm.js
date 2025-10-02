// LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log('Sign-in success:', data);
      const userId = data.user.id; // Use data.user.id from the response
      localStorage.setItem('userId', userId); // Store the userId
      navigate(`/home`); // Navigate to profile
    } catch (err) {
      console.error('Sign-in failed:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div><label>Username:</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
      <div><label>Password:</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <button type="submit" disabled={loading}>Sign In</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Signing in...</p>}
    </form>
  );
};

export default LoginForm;