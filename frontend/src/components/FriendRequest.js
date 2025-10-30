// components/FriendRequest.js - Enhanced version
import React, { useState, useEffect } from 'react';

const FriendRequest = ({ currentUserId, targetUserId, onRequestSent }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, pending, friends

  useEffect(() => {
    checkFriendStatus();
  }, [currentUserId, targetUserId]);

  const checkFriendStatus = async () => {
    if (!currentUserId || !targetUserId) return;

    try {
      const userResponse = await fetch(`/api/users/${currentUserId}`);
      const user = await userResponse.json();
      
      if (user.friends && user.friends.includes(targetUserId)) {
        setStatus('friends');
      }
    } catch (err) {
      console.error('Error checking friend status:', err);
    }
  };

  const handleSendRequest = async () => {
    if (!currentUserId) {
      alert('You must be logged in to send friend requests');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${currentUserId}/friend-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });

      const result = await response.json();
      
      if (result.success) {
        setStatus('pending');
        if (onRequestSent) onRequestSent();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to send friend request');
      console.error('Friend request error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'friends') {
    return (
      <div className="friend-request">
        <div className="connection-status connected">
          <span>✓ Friends</span>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="friend-request">
        <div className="connection-status pending">
          <span>⏳ Request Sent</span>
        </div>
      </div>
    );
  }

  return (
    <div className="friend-request">
      {error && <div className="error-message">{error}</div>}
      <button
        onClick={handleSendRequest}
        disabled={loading}
        className="btn-primary"
      >
        {loading ? 'Sending...' : 'Add Friend'}
      </button>
    </div>
  );
};

export default FriendRequest;