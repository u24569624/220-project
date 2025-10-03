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

        // Validate userId format (MongoDB ObjectId)
        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
          setError('Invalid user ID format');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/users/${userId}/projects`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }
        
        const projectsData = await response.json();
        console.log('Fetched projects:', projectsData); // Debug log
        
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
        
        {/* Projects Section */}
        <div className="projects-section">
          <h3>My Projects</h3>
          {loading ? (
            <p>Loading projects...</p>
          ) : error ? (
            <p className="error">Error: {error}</p>
          ) : projects && projects.length > 0 ? (
            projects.map(project => (
              <Link
                key={project._id}
                to={`/project/${project._id}`}
                onClick={() => setIsOpen(false)}
                className="project-link"
              >
                {project.name || `Project ${project._id}`}
              </Link>
            ))
          ) : (
            <p>No projects found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;