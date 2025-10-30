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

  if (loading) return (
    <div className="messages-section">
      <div className="loading flex items-center justify-center p-8">
        <div className="loading-spinner"></div>
        <span className="ml-2">Loading messages...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="messages-section">
      <div className="error text-error text-center p-4 bg-card-bg rounded-lg shadow">
        Error: {error}
      </div>
    </div>
  );

  return (
    <section className="messages-section">
      <div className="section-header mb-6">
        <h2 className="text-2xl font-bold">Project Messages</h2>
        <p className="text-secondary-text">Important announcements and updates</p>
      </div>
      
      {messages.length === 0 ? (
        <div className="empty-state text-center py-12 bg-card-bg rounded-lg shadow">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
          <p className="text-secondary-text">Be the first to post a message</p>
        </div>
      ) : (
        <div className="messages-list space-y-4">
          {messages.map(msg => (
            <div key={msg._id || msg.id} className="message-item bg-card-bg rounded-lg shadow p-4 border-l-4 border-accent-color">
              <div className="message-header flex justify-between items-start mb-2">
                <div className="message-author flex items-center gap-2">
                  <div className="author-avatar w-8 h-8 bg-accent-color rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {(msg.userName || 'User').charAt(0).toUpperCase()}
                  </div>
                  <strong className="text-text-color">{msg.userName || 'User'}</strong>
                </div>
                {msg.time && (
                  <span className="message-time text-sm text-secondary-text">
                    {new Date(msg.time).toLocaleString()}
                  </span>
                )}
              </div>
              <div className="message-content text-text-color">
                {msg.text}
              </div>
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="message-attachments mt-3 pt-3 border-t border-border-color">
                  <div className="text-sm text-secondary-text mb-1">Attachments:</div>
                  <div className="flex gap-2">
                    {msg.attachments.map((attachment, index) => (
                      <a 
                        key={index}
                        href={attachment.url} 
                        className="attachment-link flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded hover:bg-accent-color hover:text-white transition-colors"
                      >
                        📎 {attachment.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Messages;