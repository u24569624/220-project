import React, { useState } from 'react';

const FriendRequest = ({ userId, targetId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSendRequest = () => {
    setLoading(true);
    fetch(`/api/users/${targetId}/friends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to send friend request');
        setSent(true);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (sent) return <div>Friend request sent!</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <button
      className="friend-request"
      onClick={handleSendRequest}
      disabled={loading}
    >
      {loading ? 'Sending...' : 'Send Friend Request'}
    </button>
  );
};

export default FriendRequest;