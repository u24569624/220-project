import React, { useState, useEffect } from 'react';

const ProfilePreview = ({ id }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(data => setName(data.name))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading preview...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="profile-preview">
      <p>{name || 'Unknown User'}</p>
    </div>
  );
};

export default ProfilePreview;