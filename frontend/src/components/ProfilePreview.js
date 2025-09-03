import React from 'react';

const ProfilePreview = ({ name }) => {
  return (
    <div className="profile-preview">
      <p>{name}</p>
    </div>
  );
};

export default ProfilePreview;