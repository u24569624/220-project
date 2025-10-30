// HomePage.js
import React, { useState, useEffect, useCallback } from 'react';
import RepositoryList from '../components/RepoList';
import Header from '../components/Header';
import Feed from '../components/Feed';

const HomePage = () => {
  const userId = localStorage.getItem('userId');
  const [projects, setProjects] = useState([]);

  // Use useCallback to prevent infinite re-renders
  const fetchProjects = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`/api/users/${userId}/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  }, [userId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]); // Only re-run when fetchProjects changes

  console.log('HomePage rendering'); // Add this to check re-renders

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