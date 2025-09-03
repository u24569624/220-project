import React, { useState } from 'react';

const EditProfile = ({ name: initialName, contact: initialContact, workConnections: initialWork }) => {

  return (
    <form className="edit-profile">
      <h2>Edit Profile</h2>
      <label>
        Name:
        <input type="text"  required />
      </label>
      <label>
        Contact:
        <input type="email"  required />
      </label>
      <label>
        Work Connections:
        <input type="text"  required />
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default EditProfile;