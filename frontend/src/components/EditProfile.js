import React, { useState } from 'react';

const EditProfile = ({ id, name: initialName, contact: initialContact, workConnections: initialWork, onSave }) => {
  const [name, setName] = useState(initialName || '');
  const [contact, setContact] = useState(initialContact || '');
  const [workConnections, setWorkConnections] = useState(initialWork || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, contact, workConnections }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update profile');
        return res.json();
      })
      .then(() => {
        if (onSave) onSave({ name, contact, workConnections });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <form className="edit-profile" onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Contact:
        <input
          type="email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
      </label>
      <label>
        Work Connections:
        <input
          type="text"
          value={workConnections}
          onChange={(e) => setWorkConnections(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={loading}>Save</button>
    </form>
  );
};

export default EditProfile;