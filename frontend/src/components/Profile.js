import React from 'react';

const Profile = ({name, birthday, contact, workConnections }) => {
  return (
    <article className="profile">
      <h2>{name}</h2>
      <p>Birthday: {birthday}</p>
      <p>Contact: {contact}</p>
      <p>Work Connections: {workConnections}</p>
    </article>
  );
};

export default Profile;