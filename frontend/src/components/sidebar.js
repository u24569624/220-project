import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Assume userId is stored after login
    if (userId) {
      fetch(`/api/users/${userId}/projects`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch projects');
          return res.json();
        })
        .then(data => {
          setProjects(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching projects:', err);
          setError('Failed to load projects');
          setLoading(false);
        });
    } else {
      setError('No user logged in');
      setLoading(false);
    }
  }, []);

  return (
    <div id="sidebar-container">
      <div id="sidebar-open" onClick={() => setIsOpen(true)}>
        <div className="icon"></div>
        <div className="icon"></div>
        <div className="icon"></div>
      </div>

      <div id="sidebar-menu" className={`${isOpen ? 'show' : 'close'}`}>
        <div className="closebtn" onClick={() => setIsOpen(false)}>&times;</div>
        <Link to="/" onClick={() => setIsOpen(false)}>Splash</Link>
        <Link to="/home" onClick={() => setIsOpen(false)}>Home</Link>
        {loading ? (
          <p>Loading projects...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          projects.map(project => (
            <Link
              key={project._id}
              to={`/project/${project._id}`}
              onClick={() => setIsOpen(false)}
            >
              {project.name || `Project ${project._id}`}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;