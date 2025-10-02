// ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Profile from '../components/Profile';
import EditProfile from '../components/EditProfile';
import ProjectList from '../components/ProjectList';
import ActivityFeed from '../components/ActivityFeed';
import Friends from '../components/Friends';
import FriendRequest from '../components/FriendRequest';

const ProfilePage = () => {
  const { userId: paramUserId } = useParams();
  const storedUserId = localStorage.getItem('userId');
  const userId = paramUserId || storedUserId;
  console.log('ProfilePage userId:', userId); // Debug
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      setError('Invalid or missing user ID');
      return;
    }

    fetch(`/api/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(setUser)
      .catch(error => {
        console.error('Error fetching user:', error);
        setError('Failed to load user data');
      });
  }, [userId]);

  useEffect(() => {
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      setError('Invalid or missing user ID');
      return;
    }

    fetch(`/api/activity/local/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(setActivities)
      .catch(error => console.error('Error fetching activities:', error));
  }, [userId]);

  

  const handleEdit = (updates) => {
    fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update user');
        return res.json();
      })
      .then(setUser)
      .catch(error => console.error('Error updating user:', error));
  };

  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <Header />
      <main>
        <Profile id={userId} {...user} /> {/* Use id prop as expected */}
        <EditProfile {...user} onSave={handleEdit} />
        <Friends friendIds={user.friends || []} />
        <FriendRequest targetId={userId} />
        <ProjectList userId={userId} projectIds={user.projects || []} /> {/* Consistent prop name */}
        <ActivityFeed activities={activities} />
      </main>
    </div>
  );
};

export default ProfilePage;