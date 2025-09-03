import React, { useState } from 'react';

const Project = () => {
  // Dummy data for project
  const project = {
    name: 'Repo 1',
    description: 'A sample project for version control',
  };

  return (
    <article className="project">
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <div className="project-tabs">
        <button>
          Code
        </button>
        <button>
          Issues
        </button>
        <button>
          Pull Requests
        </button>
        <button>
          Settings
        </button>
      </div>
      <div className="tab-content">
        <p>Code content here (stubbed).</p>
        <p>Issues list here (stubbed).</p>
        <p>Pull Requests here (stubbed).</p>
        <p>Settings here (stubbed).</p>
      </div>
    </article>
  );
};

export default Project;