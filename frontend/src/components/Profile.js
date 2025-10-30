// components/Profile.js - Enhanced version
import React from 'react';

const Profile = ({ 
  id, 
  name, 
  email, 
  bio, 
  contact, 
  workConnections, 
  birthday,
  programmingLanguages = [],
  projects = [],
  friends = [] 
}) => {
  return (
    <section className="profile-details-section">
      <div className="profile-content">
        <div className="profile-section">
          <h3>About</h3>
          <p className="profile-bio">{bio || 'No bio provided.'}</p>
        </div>

        <div className="profile-section">
          <h3>Contact Information</h3>
          <div className="contact-info">
            <div className="contact-item">
              <strong>Email:</strong> {email || 'Not provided'}
            </div>
            <div className="contact-item">
              <strong>Contact:</strong> {contact || 'Not provided'}
            </div>
            {birthday && (
              <div className="contact-item">
                <strong>Birthday:</strong> {new Date(birthday).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {workConnections && (
          <div className="profile-section">
            <h3>Work Connections</h3>
            <p>{workConnections}</p>
          </div>
        )}

        <div className="profile-section">
          <h3>Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{projects.length}</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{friends.length}</span>
              <span className="stat-label">Friends</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;