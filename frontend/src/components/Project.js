// Project.js
import React from 'react';

const Project = ({ _id, name, description, image, type, hashtags }) => {
  console.log('Project component props:', { _id, name, description, image });

  return (
    <section className="project">
      <h1>{name || 'Unnamed Project'}</h1>
      {image && image !== '/uploads/img1.png' ? (
        <img src={image} alt={name} onError={(e) => {
          e.target.style.display = 'none'; // Hide broken images
        }} />
      ) : (
        <div className="project-placeholder">
          🚀 Project Image
        </div>
      )}
      <p>{description || 'No description available'}</p>
      {type && <p>Type: {type}</p>}
      {hashtags && hashtags.length > 0 && (
        <div>
          <strong>Tags:</strong> {hashtags.join(', ')}
        </div>
      )}
    </section>
  );
};

export default Project;