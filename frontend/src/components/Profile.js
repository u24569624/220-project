import React, { useState, useEffect } from 'react';

const Profile = ({ id }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data</div>;

  return (
    <article className="profile">
      <h2>{user.name}</h2>
      <p>Birthday: {user.birthday || 'Not specified'}</p>
      <p>Contact: {user.contact || 'Not specified'}</p>
      <p>Work Connections: {user.workConnections || 'Not specified'}</p>
    </article>
  );
};

export default Profile;