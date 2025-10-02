import React, { useState } from 'react';

const Discussion = ({ projectId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial messages (stubbed for now)
  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/projects/${projectId}/messages`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch messages');
        return res.json();
      })
      .then(data => setMessages(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    fetch(`/api/projects/${projectId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage, userId: localStorage.getItem('userId') }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to post message');
        return res.json();
      })
      .then(data => setMessages([...messages, data]))
      .catch(err => setError(err.message))
      .finally(() => {
        setLoading(false);
        setNewMessage('');
      });
  };

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="discussion">
      <h2>Discussion</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.message || msg}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button type="submit" disabled={loading}>Post</button>
      </form>
    </section>
  );
};

export default Discussion;