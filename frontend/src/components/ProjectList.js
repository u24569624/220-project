import React from 'react';
import ProjectPreview from './ProjectPreview';

const ProjectList = ({ projectIds }) => {
  // Dummy project data based on IDs
  const dummyProjects = projectIds.map((id) => ({
    id,
    title: `Project ${id}`,
    description: 'A sample project description.',
    date: '2025-09-01',
  }));

  return (
    <section className="project-list">
      <h2>Projects</h2>
      <ul>
        {dummyProjects.map((project) => (
          <li key={project.id}>
            <ProjectPreview title={project.title} description={project.description} date={project.date} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectList;