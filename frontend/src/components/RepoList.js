// RepoList.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CreateProject from './CreateProject';

const RepositoryList = () => {
  const userId = localStorage.getItem('userId');
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate SVG data URLs
  const generateSVGPlaceholder = useCallback((projectName = 'Project', type = 'default') => {
    const colors = {
      'web application': '#0AAFAF',
      'mobile application': '#2ea043', 
      'desktop application': '#6f42c1',
      'framework': '#d73a49',
      'library': '#f66a0a',
      'api': '#0052cc',
      'cli tool': '#6639ba',
      'game': '#e36209',
      'plugin': '#dbab09',
      'default': '#6a737d'
    };
    
    // Find the best matching color
    const typeKey = Object.keys(colors).find(key => 
      type.toLowerCase().includes(key)
    ) || 'default';
    
    const color = colors[typeKey];
    const initials = projectName.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 3);
    
    const svg = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" />
            <stop offset="100%" stop-color="${color}DD" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" 
              fill="white" font-family="Arial, sans-serif" font-size="32" font-weight="bold">
          ${initials}
        </text>
        <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" 
              fill="white" font-family="Arial, sans-serif" font-size="14" opacity="0.9">
          ${projectName.substring(0, 20)}
        </text>
        <text x="50%" y="85%" dominant-baseline="middle" text-anchor="middle" 
              fill="white" font-family="Arial, sans-serif" font-size="10" opacity="0.7">
          ${type}
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }, []);

  // Stable fetch function
  const fetchProjects = useCallback(async () => {
    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching projects for user:', userId);
      const response = await fetch(`/api/users/${userId}/projects`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }
      
      const projectsData = await response.json();
      console.log('Projects data received:', projectsData);
      
      // Ensure we always have an array
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch projects only once on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Enhanced filtering function with tag search
  const filteredProjects = React.useMemo(() => {
    if (!Array.isArray(projects)) return [];
    
    const searchTerm = filter.toLowerCase().trim();
    
    if (!searchTerm) return projects; // Show all if no filter
    
    return projects.filter(project => {
      if (!project || typeof project !== 'object') return false;
      
      const projectName = project.name || '';
      const projectDescription = project.description || '';
      const projectType = project.type || '';
      
      // Search in name, description, and type
      const basicMatch = 
        projectName.toLowerCase().includes(searchTerm) ||
        projectDescription.toLowerCase().includes(searchTerm) ||
        projectType.toLowerCase().includes(searchTerm);
      
      // Search in programming languages/tags
      const tagMatch = project.programmingLanguages && 
        project.programmingLanguages.some(lang => 
          lang.toLowerCase().includes(searchTerm)
        );
      
      // Search in hashtags (if stored separately)
      const hashtagMatch = project.tags && 
        project.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.replace('#', ''))
        );
      
      return basicMatch || tagMatch || hashtagMatch;
    });
  }, [projects, filter]);

  // Stable project creation handler
  const handleAddProject = useCallback((projectData) => {
    console.log('Creating new project:', projectData);
    
    // Generate placeholder for new project
    const placeholder = generateSVGPlaceholder(projectData.name, projectData.type);
    
    // Optimistically add the project
    const newProject = {
      _id: `temp-${Date.now()}`,
      ...projectData,
      image: {
        placeholder: placeholder,
        uploadedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      memberCount: 1,
      downloadCount: 0,
      viewCount: 0,
      version: projectData.version || '1.0.0',
      type: projectData.type || 'Web Application',
      programmingLanguages: projectData.tags || [],
      members: [userId],
      isCheckedOut: false
    };
    
    setProjects(prev => [newProject, ...prev]);
    
    // Then make the actual API call
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...projectData, ownerId: userId }),
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to create project');
      return response.json();
    })
    .then(actualProject => {
      // Replace temporary project with actual one
      setProjects(prev => 
        prev.map(p => p._id === newProject._id ? actualProject : p)
      );
    })
    .catch(err => {
      console.error('Error creating project:', err);
      // Remove temporary project on error
      setProjects(prev => prev.filter(p => p._id !== newProject._id));
      alert('Failed to create project. Please try again.');
    });
  }, [userId, generateSVGPlaceholder]);

  // Clear filter function
  const clearFilter = useCallback(() => {
    setFilter('');
  }, []);

  if (loading) {
    return (
      <section className="repository-section">
        <div className="section-header">
          <h2>Your Repositories</h2>
          <CreateProject onCreate={handleAddProject} />
        </div>
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading repositories...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="repository-section">
        <div className="section-header">
          <h2>Your Repositories</h2>
          <CreateProject onCreate={handleAddProject} />
        </div>
        <div className="error">
          <p>Error loading repositories: {error}</p>
          <button 
            onClick={fetchProjects}
            className="btn btn-primary"
          >
            <span className="material-symbols-outlined">refresh</span>
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="repository-section">
      <div className="section-header">
        <h2>Your Repositories</h2>
        <CreateProject onCreate={handleAddProject} />
      </div>
      
      <div className="repo-controls">
        <div className="search-container">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Search repositories by name, description, type, or tags..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="repo-filter"
          />
          {filter && (
            <button 
              onClick={clearFilter}
              className="btn btn-sm clear-btn"
              title="Clear search"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="repo-stats">
        <small>
          <span className="material-symbols-outlined">folder</span>
          Showing {filteredProjects.length} of {projects.length} repositories
          {filter && ` for "${filter}"`}
        </small>
      </div>
      
      <div className="repo-grid">
        {filteredProjects.map(project => (
          <RepoCard 
            key={project._id} 
            project={project} 
            generateSVGPlaceholder={generateSVGPlaceholder}
          />
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="empty-repos">
          {filter ? (
            <>
              <span className="material-symbols-outlined large-icon">search_off</span>
              <h3>No repositories found</h3>
              <p>No repositories match "{filter}"</p>
              <button 
                onClick={clearFilter}
                className="btn btn-primary"
              >
                <span className="material-symbols-outlined">clear_all</span>
                Show all repositories
              </button>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined large-icon">folder_off</span>
              <h3>No repositories yet</h3>
              <p>Create your first project to get started!</p>
              <CreateProject onCreate={handleAddProject} />
            </>
          )}
        </div>
      )}
    </section>
  );
};

// Separate component for project cards to optimize rendering
const RepoCard = React.memo(({ project, generateSVGPlaceholder }) => {
  if (!project) return null;

  // Smart image URL resolver
  const getProjectImage = (project) => {
    // If project has a custom image URL, use it
    if (project.image?.url) {
      return project.image.url;
    }
    
    // If project already has a placeholder, use it
    if (project.image?.placeholder) {
      return project.image.placeholder;
    }
    
    // Generate a new placeholder based on project data
    const projectName = project.name || 'Project';
    const projectType = project.type || 'default';
    
    return generateSVGPlaceholder(projectName, projectType);
  };

  const projectName = project.name || 'Unnamed Project';
  const projectType = project.type || 'Unknown Type';
  const imageUrl = getProjectImage(project);

  return (
    <div className="repo-card">
      <Link to={`/project/${project._id}`} className="repo-link">
        <img 
          src={imageUrl}
          alt={projectName}
          className="repo-image"
          onError={(e) => {
            // Ultimate fallback - generate basic SVG
            const colors = ['#0AAFAF', '#2ea043', '#6f42c1', '#d73a49'];
            const color = colors[projectName.length % colors.length];
            const initials = projectName.substring(0, 2).toUpperCase();
            
            const fallbackSvg = `
              <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="${color}"/>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                      fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
                  ${initials}
                </text>
              </svg>
            `;
            e.target.src = `data:image/svg+xml;base64,${btoa(fallbackSvg)}`;
          }}
        />
        <div className="repo-info">
          <h3 className="repo-name">
            <span className="material-symbols-outlined repo-icon">folder</span>
            {projectName}
          </h3>
          <p className="repo-description">
            {project.description || 'No description provided'}
          </p>
          <div className="repo-meta">
            <span className="repo-type">
              <span>category</span>
              {projectType}
            </span>
            <span className="repo-version">
              <span className="material-symbols-outlined">tag</span>
              v{project.version || '1.0.0'}
            </span>
          </div>
          {project.programmingLanguages && project.programmingLanguages.length > 0 && (
            <div className="repo-tags">
              {project.programmingLanguages.map((lang, index) => (
                <span key={`${project._id}-${lang}-${index}`} className="repo-tag">
                  <span className="material-symbols-outlined">local_offer</span>
                  #{lang}
                </span>
              ))}
            </div>
          )}
          <div className="repo-stats">
            <span title="Members">
              <span className="material-symbols-outlined">people</span>
              {project.members?.length || project.memberCount || 1}
            </span>
            <span title="Downloads">
              <span className="material-symbols-outlined">download</span>
              {project.downloadCount || 0}
            </span>
            <span title="Views">
              <span className="material-symbols-outlined">visibility</span>
              {project.viewCount || 0}
            </span>
          </div>
          <div className="repo-status">
            {project.isCheckedOut ? (
              <span className="status-checked-out" title="Checked Out">
                <span className="material-symbols-outlined">lock</span>
                Checked Out
              </span>
            ) : (
              <span className="status-available" title="Available">
                <span className="material-symbols-outlined">lock_open</span>
                Available
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
});

export default RepositoryList;