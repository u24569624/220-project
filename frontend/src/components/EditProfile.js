// components/EditProfile.js - Enhanced version
import React, { useState } from 'react';

const EditProfile = ({ 
  id, 
  name: initialName, 
  email: initialEmail,
  bio: initialBio,
  contact: initialContact, 
  workConnections: initialWork, 
  birthday: initialBirthday,
  onSave,
  onCancel 
}) => {
  const [name, setName] = useState(initialName || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [bio, setBio] = useState(initialBio || '');
  const [contact, setContact] = useState(initialContact || '');
  const [workConnections, setWorkConnections] = useState(initialWork || '');
  const [birthday, setBirthday] = useState(initialBirthday || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          bio,
          contact, 
          workConnections, 
          birthday 
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      const result = await response.json();
      onSave(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="edit-profile">
      <h2>Edit Profile</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            maxLength="500"
          />
          <div className="char-count">{bio.length}/500</div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact">Contact Info</label>
            <input
              id="contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone number or other contact"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="birthday">Birthday</label>
            <input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="workConnections">Work Connections</label>
          <input
            id="workConnections"
            type="text"
            value={workConnections}
            onChange={(e) => setWorkConnections(e.target.value)}
            placeholder="Current company or professional connections"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="btn-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditProfile;