// Messages.js
import React, { useState, useEffect } from 'react';

const Messages = ({ projectId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setError('No project ID provided');
      setLoading(false);
      return;
    }

    console.log('Messages - Fetching for project:', projectId);
    
    setLoading(true);
    fetch(`/api/projects/${projectId}/messages`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Messages data received:', data);
        setMessages(data);
      })
      .catch(err => {
        console.error('Error fetching messages:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="messages">
      <h2>Messages</h2>
      {messages.length === 0 ? (
        <p>No messages found</p>
      ) : (
        <ul>
          {messages.map(msg => (
            <li key={msg._id || msg.id}>
              <strong>{msg.userName || 'User'}:</strong> {msg.text} 
              {msg.time && ` - ${new Date(msg.time).toLocaleString()}`}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Messages;
