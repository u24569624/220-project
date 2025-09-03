import React, { useState } from 'react';
import ProjectPreview from './ProjectPreview';

const Feed = () => {
  // Dummy data for feed items
  const feedItems = [
    { id: 1, user: 'User1', desc: 'First project update', date: '2025-09-02' },
    { id: 2, user: 'User2', desc: 'Team collaboration started', date: '2025-09-01' },
    { id: 3, user: 'User3', desc: 'New feature added', date: '2025-09-03' },
  ];

  return (
    <section className="feed">

      <div className="feed-controls">
        <div className="feed-tabs">
          <button>
            Local
          </button>
          <button>
            Global
          </button>
        </div>
        <select className="sort-select">
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