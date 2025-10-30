// components/Friends.js - Updated with clickable profiles
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Friends = ({ friendIds, currentUserId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      if (!friendIds || friendIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const friendPromises = friendIds.map(id =>
          fetch(`/api/users/${id}`).then(res => res.json())
        );
        const friendsData = await Promise.all(friendPromises);
        setFriends(friendsData);
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [friendIds]);

  const handleUnfriend = async (friendId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;

    try {
      const response = await fetch(`/api/users/${currentUserId}/friends`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId }),
      });

      if (response.ok) {
        setFriends(friends.filter(friend => friend._id !== friendId));
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      alert('Failed to remove friend');
    }
  };

  const handleFriendClick = (friendId) => {
    navigate(`/profile/${friendId}`);
  };

  if (loading) return <div className="friends-section">Loading friends...</div>;

  return (
    <section className="friends-section">
      <h2>Friends ({friends.length})</h2>
      
      {friends.length === 0 ? (
        <p className="text-muted">No friends yet</p>
      ) : (
        <div className="friends-grid">
          {friends.map(friend => (
            <div 
              key={friend._id} 
              className="friend-card"
              onClick={() => handleFriendClick(friend._id)}
            >
              <div className="friend-avatar">
                {friend.name ? friend.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="friend-name">{friend.name || 'Unknown User'}</div>
              <div className="friend-username">
                @{friend.username || friend.email?.split('@')[0]}
              </div>
              
              {currentUserId && (
                <div className="friend-actions" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => handleUnfriend(friend._id)}
                    className="btn-outline btn-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Friends;