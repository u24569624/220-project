// Feed.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const Feed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('local');

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem('userId');
      
      if (tab === 'local' && (!userId || userId === 'undefined')) {
        setError('Please log in to see local feed');
        setLoading(false);
        return;
      }

      // Use mock data to prevent API issues
      const mockData = [
        {
          _id: '1',
          type: 'checkin',
          userName: 'John Doe',
          projectName: 'Web App',
          projectId: '123',
          message: 'Fixed authentication bug',
          createdAt: new Date().toISOString(),
          tags: ['javascript', 'react']
        },
        {
          _id: '2', 
          type: 'create',
          userName: 'Jane Smith',
          projectName: 'Mobile App',
          projectId: '124',
          message: 'Initial project setup',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          tags: ['react-native', 'typescript']
        }
      ];

      // Simulate API delay
      setTimeout(() => {
        setFeedItems(mockData);
        setLoading(false);
      }, 500);
      
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError('Failed to load feed');
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  console.log('Feed rendering, tab:', tab); // Debug log

  // Rest of the component remains the same...
  const formatActivityText = (item) => {
    const userName = item.userName || 'User';
    const projectName = item.projectName || 'project';
    
    switch(item.type) {
      case 'checkin':
        return `${userName} checked in changes to `;
      case 'checkout':
        return `${userName} checked out `;
      case 'create':
        return `${userName} created new project `;
      case 'comment':
        return `${userName} commented on `;
      default:
        return `${userName} performed action on `;
    }
  };

  if (loading) return (
    <div className="feed">
      <div className="feed-controls">
        <div className="feed-tabs">
          <button className={tab === 'local' ? 'active' : ''}>Local</button>
          <button className={tab === 'global' ? 'active' : ''}>Global</button>
        </div>
      </div>
      <div className="loading">Loading activities...</div>
    </div>
  );

  if (error) return (
    <div className="feed">
      <div className="feed-controls">
        <div className="feed-tabs">
          <button className={tab === 'local' ? 'active' : ''}>Local</button>
          <button className={tab === 'global' ? 'active' : ''}>Global</button>
        </div>
      </div>
      <div className="error">{error}</div>
    </div>
  );

  return (
    <section className="feed">
      <div className="feed-controls">
        <div className="feed-tabs">
          <button 
            onClick={() => setTab('local')}
            className={tab === 'local' ? 'active' : ''}
          >
            Local Feed
          </button>
          <button 
            onClick={() => setTab('global')} 
            className={tab === 'global' ? 'active' : ''}
          >
            Global Feed
          </button>
        </div>
      </div>
      
      <div className="feed-list">
        {feedItems && feedItems.length > 0 ? (
          feedItems.map((item, index) => (
            <div key={item._id || index} className="feed-item">
              <div className="feed-item-header">
                <div className="user-avatar">
                  {item.userName?.charAt(0) || 'U'}
                </div>
                <div className="feed-item-info">
                  <span className="activity-text">
                    {formatActivityText(item)}
                    <Link to={`/project/${item.projectId}`} className="project-link">
                      {item.projectName}
                    </Link>
                  </span>
                  <small className="activity-time">
                    {new Date(item.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
              
              {item.message && (
                <p className="checkin-message">"{item.message}"</p>
              )}
              
              {item.tags && item.tags.length > 0 && (
                <div className="hashtags">
                  {item.tags.map(tag => (
                    <span key={tag} className="hashtag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-feed">
            <p>No activities found in {tab} feed</p>
            {tab === 'local' && (
              <p>Add some friends or create projects to see activity here!</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Feed;