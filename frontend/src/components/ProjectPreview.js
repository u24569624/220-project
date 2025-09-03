import React from 'react';

const ProjectPreview = ({ title, description, date }) => {
  return (
    <div className="project-preview">
      <h3>{title}</h3>
      <p>{description}</p>
      <p>Date: {date}</p>
    </div>
  );
};

export default ProjectPreview;