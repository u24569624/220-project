import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/sidebar';
import Profile from '../components/Profile';
import EditProfile from '../components/EditProfile';
import Friends from '../components/Friends';
import FriendRequest from '../components/FriendRequest';
import ProjectList from '../components/ProjectList';
import ActivityFeed from '../components/ActivityFeed.js';

const ProfilePage = () => {
  // Dummy data for profile (replace with API call in future)
  const user = {
    id: 'user123',
    name: 'Jane Doe',
    birthday: '1995-05-15',
    contact: 'jane.doe@example.com',
    workConnections: 'Tech Corp',
    friends: ['friend456', 'friend789'],
    projects: ['proj101', 'proj202'],
    activity: [
      { type: 'check-in', project: 'proj101', date: '2025-09-02' },
      { type: 'check-out', project: 'proj202', date: '2025-09-01' },
    ],
  };

  return (
    <div className="profile-page">
      <Header />
      <div className="main-content">
        <main>
          <Profile
            name={user.name}
            birthday={user.birthday}
            contact={user.contact}
            workConnections={user.workConnections}
          />
          <EditProfile
            name={user.name}
            contact={user.contact}
            workConnections={user.workConnections}
            onSave={() => alert('Profile updated! (Dummy response)')}
          />
          <Friends friendIds={user.friends} />
          <FriendRequest targetId={user.id} />
          <ProjectList projectIds={user.projects} />
          <ActivityFeed activities={user.activity} />
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;