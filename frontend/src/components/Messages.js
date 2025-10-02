import React, { useState, useEffect } from 'react';

const Messages = ({ projectId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="messages">
      <h2>Messages</h2>
      <ul>
        {messages.map(msg => (
          <li key={msg.id}>{msg.text} - {msg.time ? new Date(msg.time).toLocaleString() : 'Unknown'}</li>
        ))}
      </ul>
    </section>
  );
};

export default Messages;