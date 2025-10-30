import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreateProject from './CreateProject';

const RepositoryList = () => {
  const userId = localStorage.getItem('userId');
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch(`/api/users/${userId}/projects`)
      .then(res => res.json())
      .then(setProjects);
  }, [userId]);

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleAddProject = (projectData) => {
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...projectData, ownerId: userId }),
    }).then(() => fetch(`/api/users/${userId}/projects`).then(res => res.json()).then(setProjects));
  };

  return (
    <section className="repository-section">
      <div className="section-header">
        <h2>Your Repositories</h2>
        <CreateProject onCreate={handleAddProject} />
      </div>
      
      <div className="repo-controls">
        <input
          type="text"
          placeholder="Filter repositories or hashtags..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="repo-filter"
        />
      </div>
      
      <div className="repo-grid">
        {filteredProjects.map(project => (
          <div key={project._id} className="repo-card">
            <Link to={`/project/${project._id}`} className="repo-link">
              <img 
                src={project.image || '/assets/images/default-project.png'} 
                alt={project.name}
                className="repo-image"
              />
              <div className="repo-info">
                <h3 className="repo-name">{project.name}</h3>
                <p className="repo-description">{project.description}</p>
                <div className="repo-meta">
                  <span className="repo-type">{project.type}</span>
                  <span className="repo-version">v{project.version}</span>
                </div>
                {project.tags && project.tags.length > 0 && (
                  <div className="repo-tags">
                    {project.tags.map(tag => (
                      <Link 
                        key={tag} 
                        to={`/search?tag=${tag}`}
                        className="repo-tag"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
                <div className="repo-stats">
                  <span>👥 {project.memberCount || 1} members</span>
                  <span>📥 {project.downloadCount || 0} downloads</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="empty-repos">
          <p>No repositories found</p>
          {filter && <p>Try adjusting your search filter</p>}
        </div>
      )}
    </section>
  );
};

export default RepositoryList;