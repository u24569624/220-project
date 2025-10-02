// frontend/src/components/Friends.js
import React from 'react';

const Friends = ({ friendIds }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2>Friends</h2>
    {friendIds && Array.isArray(friendIds) ? (
      friendIds.map(id => <div key={id} className="p-2 border-b">{id}</div>)
    ) : (
      <p>No friends available</p>
    )}
  </div>
);

export default Friends;