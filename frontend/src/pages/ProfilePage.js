import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Profile from '../components/Profile';
import EditProfile from '../components/EditProfile';
import ProjectList from '../components/ProjectList';
import ActivityFeed from '../components/ActivityFeed';
import Friends from '../components/Friends';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Validate ID (basic check for MongoDB ObjectId length and format)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId) {
      setError('Invalid user ID');
      return;
    }

    fetch(`/api/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(setUser)
      .catch(error => {
        console.error('Error fetching user:', error);
        setError('Failed to load user data');
      });
  }, [id]);

  useEffect(() => {
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId) {
      setError('Invalid user ID');
      return;
    }

    fetch(`/api/activity/local/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(setActivities)
      .catch(error => console.error('Error fetching activities:', error));
  }, [id]);

  const handleEdit = (updates) => {
    fetch(`/api/users/${id}`, {
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
        <Profile {...user} />
        <EditProfile {...user} onSave={handleEdit} />
        <Friends friendIds={user.friends || []} />
        <ProjectList projectIds={user.projects || []} />
        <ActivityFeed activities={activities} />
      </main>
    </div>
  );
};

export default ProfilePage;