// RepoList.js
import React, { useState, useEffect } from 'react';
import CreateProject from './CreateProject';
//import '../styles/tailwind.css'; // Replace RepoList.css

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
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddProject = (projectData) => {
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...projectData, ownerId: userId }),
    }).then(() => fetch(`/api/users/${userId}/projects`).then(res => res.json()).then(setProjects));
  };

  return (
    <section >
      <h2>Repositories</h2>
      <CreateProject onCreate={handleAddProject} />
      <div>
        <input
          type="text"
          placeholder="Filter repositories..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <button>Add</button>
      </div>
      <ul className="repo-list">
        {filteredProjects.map(repo => (
          <li key={repo._id}>
            {repo.name} - {repo.description}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RepositoryList;