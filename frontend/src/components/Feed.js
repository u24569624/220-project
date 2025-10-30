import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Feed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('local');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'popularity'

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = localStorage.getItem('userId');
        
        if (tab === 'local' && (!userId || userId === 'undefined')) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        const endpoint = tab === 'local' 
          ? `/api/activity/local/${userId}` 
          : '/api/activity/global';
        
        const response = await fetch(endpoint);
        
        if (!response.ok) throw new Error(`Failed to fetch feed: ${response.status}`);
        
        let data = await response.json();
        
        // Reverse chronological sorting by creation date
        data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // If sorting by popularity, re-sort
        if (sortBy === 'popularity') {
          data = data.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
        }
        
        setFeedItems(data);
        
      } catch (err) {
        console.error('Error fetching feed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [tab, sortBy]);

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

  if (loading) return <div className="loading">Loading feed...</div>;
  if (error) return <div className="error">Error: {error}</div>;

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
        
        <div className="feed-sorting">
          <label htmlFor="sort-select">Sort by:</label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Most Recent</option>
            <option value="popularity">Most Popular</option>
          </select>
        </div>
      </div>
      
      <div className="feed-list">
        {feedItems && feedItems.length > 0 ? (
          feedItems.map((item, index) => (
            <div key={item._id || index} className="feed-item card">
              <div className="feed-item-header">
                <img 
                  src={item.userAvatar || '/assets/images/default-avatar.png'} 
                  alt={item.userName} 
                  className="user-avatar"
                />
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
              
              {item.projectImage && (
                <img 
                  src={item.projectImage} 
                  alt={item.projectName} 
                  className="project-thumbnail"
                />
              )}
              
              {item.message && (
                <p className="checkin-message">"{item.message}"</p>
              )}
              
              {item.tags && item.tags.length > 0 && (
                <div className="hashtags">
                  {item.tags.map(tag => (
                    <Link 
                      key={tag} 
                      to={`/search?tag=${tag}`}
                      className="hashtag"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
              
              <div className="activity-stats">
                <span>📥 {item.downloadCount || 0} downloads</span>
                <span>👁️ {item.viewCount || 0} views</span>
              </div>
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