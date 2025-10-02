import React from 'react';

const ProjectPreview = ({ title, description, date }) => {
  return (
    <div className="project-preview">
      <h3>{title || 'Untitled Project'}</h3>
      <p>{description || 'No description'}</p>
      <p>Date: {date ? new Date(date).toLocaleDateString() : 'Unknown'}</p>
    </div>
  );
};

export default ProjectPreview;