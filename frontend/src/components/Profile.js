// Profile.js
import React, { useState, useEffect } from 'react';

const Profile = ({ id, ...user }) => {
  const [profileUser, setProfileUser] = useState(null); // Renamed to avoid conflict
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      setError('Invalid user ID');
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(data => setProfileUser(data)) // Use setProfileUser
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profileUser) return <div>No user data</div>;

  return (
    <article className="profile">
      <h2>{profileUser.name || user.name}</h2> {/* Fallback to props if needed */}
      <p>Birthday: {profileUser.birthday || 'Not specified'}</p>
      <p>Contact: {profileUser.contact || 'Not specified'}</p>
      <p>Work Connections: {profileUser.workConnections || 'Not specified'}</p>
    </article>
  );
};

export default Profile;