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
    <section className="repository-list bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold">Repositories</h2>
      <CreateProject onCreate={handleAddProject} />
      <div className="repository-controls mt-2">
        <input
          type="text"
          placeholder="Filter repositories..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button className="bg-blue-500 text-white p-2 w-full">Add</button>
      </div>
      <ul className="repo-list">
        {filteredProjects.map(repo => (
          <li key={repo._id} className="repo-item p-2 border-b">
            {repo.name} - {repo.description}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RepositoryList;