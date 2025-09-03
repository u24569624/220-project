import React from 'react';
import ProfilePreview from './ProfilePreview';

const Friends = ({ friendIds }) => {
  // Dummy friend data based on IDs
  const dummyFriends = friendIds.map((id) => ({
    id,
    name: `Friend ${id}`,
  }));

  return (
    <section className="friends">
      <h2>Friends</h2>
      <ul>
        {dummyFriends.map((friend) => (
          <li key={friend.id}>
            <ProfilePreview name={friend.name} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Friends;