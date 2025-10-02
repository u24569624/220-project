// Feed.js
import React, { useState, useEffect } from 'react';
import ProjectPreview from './ProjectPreview';

const Feed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('local');

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = localStorage.getItem('userId');
        
        console.log('Feed - User ID:', userId, 'Tab:', tab);
        
        if (tab === 'local' && (!userId || userId === 'undefined')) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        // USE /api/ PREFIX LIKE PROFILEPAGE
        const endpoint = tab === 'local' 
          ? `/api/activity/local/${userId}` 
          : '/api/activity/global';
        
        console.log('Fetching from endpoint:', endpoint);
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch feed: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Feed data received:', data);
        setFeedItems(data);
        
      } catch (err) {
        console.error('Error fetching feed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [tab]);

  console.log('Feed State - loading:', loading, 'error:', error, 'items:', feedItems);

  if (loading) return <div>Loading feed...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="feed">
      <div className="feed-controls">
        <div className="feed-tabs">
          <button 
            onClick={() => setTab('local')}
            className={tab === 'local' ? 'active' : ''}
          >
            Local
          </button>
          <button 
            onClick={() => setTab('global')}
            className={tab === 'global' ? 'active' : ''}
          >
            Global
          </button>
        </div>
      </div>
      
      <div className="feed-list">
        {feedItems && feedItems.length > 0 ? (
          feedItems.map((item, index) => (
            <div key={item._id || index} className="feed-item">
              <strong>{item.userName || 'User'}</strong>: {item.type}
              <br />
              <small>{new Date(item.date).toLocaleString()}</small>
              <hr />
            </div>
          ))
        ) : (
          <p>No activities found in feed</p>
        )}
      </div>
    </section>
  );
};

export default Feed;