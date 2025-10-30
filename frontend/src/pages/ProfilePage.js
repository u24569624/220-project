// ProfilePage.js - Updated version
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Profile from '../components/Profile';
import EditProfile from '../components/EditProfile';
import ProjectList from '../components/ProjectList';
import ActivityFeed from '../components/ActivityFeed';
import Friends from '../components/Friends';
import FriendRequest from '../components/FriendRequest';
import TagCloud from '../components/TagCloud';
import '../styles/profile.css';

const ProfilePage = () => {
  const { userId: paramUserId } = useParams();
  const storedUserId = localStorage.getItem('userId');
  const currentUserId = storedUserId;
  const profileUserId = paramUserId || storedUserId;
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUserId === profileUserId;

  useEffect(() => {
    if (!profileUserId || !/^[0-9a-fA-F]{24}$/.test(profileUserId)) {
      setError('Invalid or missing user ID');
      setLoading(false);
      return;
    }

    fetchUserData();
    fetchActivities();
  }, [profileUserId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${profileUserId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/activity/local/${profileUserId}`);
      if (response.ok) {
        const activitiesData = await response.json();
        setActivities(activitiesData);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleEdit = async (updates) => {
    try {
      const response = await fetch(`/api/users/${profileUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error('Failed to update user');
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (file) => {
    // Implement avatar upload functionality
    console.log('Uploading avatar:', file);
    // Add your file upload logic here
  };

  if (loading) return (
    <div className="profile-page">
      <Header />
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="profile-page">
      <Header />
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/home')} className="btn-primary">
          Return to Home
        </button>
      </div>
    </div>
  );

  if (!user) return (
    <div className="profile-page">
      <Header />
      <div className="error">
        <h2>User Not Found</h2>
        <p>The user you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <Header />
      <main>
        {/* Profile Header */}
        <section className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              {isOwnProfile && (
                <label className="avatar-upload" title="Upload new photo">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleAvatarUpload(e.target.files[0])}
                  />
                  📷
                </label>
              )}
            </div>
            
            <div className="profile-details">
              <h1 className="profile-name">
                {user.name}
                {user.verified && <span className="verification-badge">✓ Verified</span>}
              </h1>
              <p className="profile-username">@{user.username || user.email?.split('@')[0]}</p>
              {user.bio && <p className="profile-bio">{user.bio}</p>}
              
              <div className="profile-meta">
                <div className="meta-item">
                  <span className="meta-label">Joined</span>
                  <span className="meta-value">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Projects</span>
                  <span className="meta-value">{user.projects?.length || 0}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Friends</span>
                  <span className="meta-value">{user.friends?.length || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="profile-actions">
              {isOwnProfile ? (
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-primary"
                >
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </button>
              ) : (
                <div className="connection-status connected">
                  <span>✓ Connected</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="profile-main">
          {isEditing && isOwnProfile ? (
            <EditProfile {...user} onSave={handleEdit} onCancel={() => setIsEditing(false)} />
          ) : (
            <>
              <Profile {...user} />
              <ProjectList userId={profileUserId} />
            </>
          )}
          
          <ActivityFeed activities={activities} />
        </div>

        {/* Sidebar */}
        <aside className="profile-sidebar">
          <Friends friendIds={user.friends || []} currentUserId={currentUserId} />
          
          {!isOwnProfile && (
            <FriendRequest 
              currentUserId={currentUserId} 
              targetUserId={profileUserId} 
              onRequestSent={fetchUserData}
            />
          )}
          
          <TagCloud languages={user.programmingLanguages || []} />
        </aside>
      </main>
    </div>
  );
};

export default ProfilePage;