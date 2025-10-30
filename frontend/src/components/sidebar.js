import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          setError('No user logged in');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/users/${userId}/projects`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }
        
        const projectsData = await response.json();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar-menu');
      const hamburger = document.getElementById('sidebar-open');
      
      if (isOpen && sidebar && !sidebar.contains(event.target) && hamburger && !hamburger.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="sidebar-container">
      {/* Hamburger Menu */}
      <button 
        id="sidebar-open" 
        className="hamburger-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Menu */}
      <aside 
        id="sidebar-menu" 
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
      >
        <div className="sidebar-header">
          <h3>Navigation</h3>
          <button 
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h4 className="nav-section-title">Main</h4>
            <Link to="/home" onClick={() => setIsOpen(false)} className="nav-link">
              <span className="nav-icon">🏠</span>
              Home
            </Link>
            <Link to="/profile" onClick={() => setIsOpen(false)} className="nav-link">
              <span className="nav-icon">👤</span>
              My Profile
            </Link>
            <Link to="/search" onClick={() => setIsOpen(false)} className="nav-link">
              <span className="nav-icon">🔍</span>
              Search
            </Link>
          </div>

          {/* Projects Section */}
          <div className="nav-section">
            <h4 className="nav-section-title">My Projects</h4>
            {loading ? (
              <div className="sidebar-loading">Loading projects...</div>
            ) : error ? (
              <div className="sidebar-error">Error loading projects</div>
            ) : projects && projects.length > 0 ? (
              projects.map(project => (
                <Link
                  key={project._id}
                  to={`/project/${project._id}`}
                  onClick={() => setIsOpen(false)}
                  className="nav-link project-link"
                  title={project.description}
                >
                  <span className="nav-icon">📁</span>
                  <span className="project-name">
                    {project.name || `Project ${project._id}`}
                  </span>
                </Link>
              ))
            ) : (
              <div className="sidebar-empty">
                No projects yet
                <Link 
                  to="/create-project" 
                  className="create-project-btn"
                  onClick={() => setIsOpen(false)}
                >
                  Create your first project
                </Link>
              </div>
            )}
          </div>

          <div className="nav-section">
            <h4 className="nav-section-title">Actions</h4>
            <Link to="/create-project" onClick={() => setIsOpen(false)} className="nav-link highlight">
              <span className="nav-icon">➕</span>
              Create New Project
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <small>User ID: {localStorage.getItem('userId')?.substring(0, 8)}...</small>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;