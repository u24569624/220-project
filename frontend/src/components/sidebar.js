import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
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
  }, [userId]);

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

  // Handle navigation and close sidebar
  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="sidebar-container">
      {/* Hamburger Menu */}
      <button 
        id="sidebar-open" 
        className="hamburger-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined">menu</span>
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
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h4 className="nav-section-title">Main</h4>
            <button 
              onClick={() => handleNavigation('/home')} 
              className="nav-link"
            >
              <span className="material-symbols-outlined nav-icon">home</span>
              Home
            </button>
            <button 
              onClick={() => handleNavigation(`/profile/${userId}`)} 
              className="nav-link"
            >
              <span className="material-symbols-outlined nav-icon">person</span>
              My Profile
            </button>
            <button 
              onClick={() => handleNavigation('/search')} 
              className="nav-link"
            >
              <span className="material-symbols-outlined nav-icon">search</span>
              Search
            </button>
          </div>

          {/* Projects Section */}
          <div className="nav-section">
            <h4 className="nav-section-title">My Projects</h4>
            {loading ? (
              <div className="sidebar-loading">
                <span className="material-symbols-outlined">progress_activity</span>
                Loading projects...
              </div>
            ) : error ? (
              <div className="sidebar-error">
                <span className="material-symbols-outlined">error</span>
                Error loading projects
              </div>
            ) : projects && projects.length > 0 ? (
              projects.map(project => (
                <button
                  key={project._id}
                  onClick={() => handleNavigation(`/project/${project._id}`)}
                  className="nav-link project-link"
                  title={project.description}
                >
                  <span className="material-symbols-outlined nav-icon">folder</span>
                  <span className="project-name">
                    {project.name || `Project ${project._id}`}
                  </span>
                </button>
              ))
            ) : (
              <div className="sidebar-empty">
                <span className="material-symbols-outlined">folder_off</span>
                No projects yet
                <button 
                  onClick={() => handleNavigation('/create-project')}
                  className="create-project-btn"
                >
                  <span className="material-symbols-outlined">add</span>
                  Create your first project
                </button>
              </div>
            )}
          </div>

          <div className="nav-section">
            <h4 className="nav-section-title">Actions</h4>
            <button 
              onClick={() => handleNavigation('/create-project')}
              className="nav-link highlight"
            >
              <span className="material-symbols-outlined nav-icon">add_circle</span>
              Create New Project
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <small>
              <span className="material-symbols-outlined">fingerprint</span>
              ID: {userId?.substring(0, 8)}...
            </small>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;