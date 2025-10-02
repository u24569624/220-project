import React, { useState, useEffect } from 'react';
import ProjectPreview from './ProjectPreview';

const Feed = ({ userId }) => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('local');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    setLoading(true);
    const endpoint = tab === 'local' ? `/api/activity/local/${userId}` : '/api/activity/global';
    fetch(endpoint)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch feed');
        return res.json();
      })
      .then(data => setFeedItems(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId, tab]);

  const handleSort = (e) => {
    setSortBy(e.target.value);
    const sortedItems = [...feedItems].sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      return 0; // Add more sorting logic if needed
    });
    setFeedItems(sortedItems);
  };

  if (loading) return <div>Loading feed...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="feed">
      <div className="feed-controls">
        <div className="feed-tabs">
          <button onClick={() => setTab('local')}>Local</button>
          <button onClick={() => setTab('global')}>Global</button>
        </div>
        <select className="sort-select" value={sortBy} onChange={handleSort}>
          <option value="date">Date</option>
          {/* Add more options (e.g., popularity) if time permits */}
        </select>
      </div>
      <ul className="feed-list">
        {feedItems.map(item => (
          <ProjectPreview key={item.id} user={item.user} desc={item.desc} date={item.date} />
        ))}
      </ul>
    </section>
  );
};

export default Feed;