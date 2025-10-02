import React, { useState, useEffect } from 'react';
import ProjectPreview from './ProjectPreview';

const ProjectList = ({ userId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}/projects`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
      })
      .then(data => setProjects(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="project-list">
      <h2>Projects</h2>
      <ul>
        {projects.map(project => (
          <li key={project._id}>
            <ProjectPreview
              title={project.name || `Project ${project._id}`}
              description={project.description || 'No description'}
              date={project.date || 'Unknown'}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectList;