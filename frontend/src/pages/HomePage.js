// HomePage.js
import React, { useState, useEffect } from 'react';
import RepositoryList from '../components/RepoList';
import Header from '../components/Header';

const HomePage = () => {
  const userId = localStorage.getItem('userId');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`/api/users/${userId}/projects`)
      .then(res => res.json())
      .then(setProjects);
  }, [userId]);

  return (
    <div className="home-page">
      <Header />
      <main className="flex">
        <RepositoryList />
        <div className="feed bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Feed</h2>
          {projects.map(p => <div key={p._id}>Activity for {p.name}</div>)}
        </div>
      </main>
    </div>
  );
};

export default HomePage;