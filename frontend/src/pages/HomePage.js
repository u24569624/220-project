// HomePage.js
import React, { useState, useEffect } from 'react';
import RepositoryList from '../components/RepoList';
import Header from '../components/Header';
import Feed from '../components/Feed';

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
      <main>
        <div className="home-content">
          <RepositoryList />
        </div>
        <div className="home-sidebar">
          <Feed />
        </div>
      </main>
    </div>
  );
};

export default HomePage;