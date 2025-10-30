import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Project from '../components/Project';
import Files from '../components/Files';
import Messages from '../components/Messages';
import Discussion from '../components/Discussion';
import EditProject from '../components/EditProject';
import Issues from '../components/Issues';
import PullRequests from '../components/PullRequests';
import Stats from '../components/Stats';

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('files');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  console.log('ProjectPage - Project ID from URL:', id);

  useEffect(() => {
    if (!id) {
      setError('No project ID provided');
      return;
    }

    fetchProjectData();
    fetchCheckins();
  }, [id]);

  const fetchProjectData = () => {
    fetch(`/api/projects/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch project');
        return res.json();
      })
      .then(projectData => {
        console.log('Project data received:', projectData);
        setProject(projectData);
      })
      .catch(err => {
        console.error('Error fetching project:', err);
        setError(err.message);
      });
  };

  const fetchCheckins = () => {
    fetch(`/api/projects/${id}/checkins`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch checkins');
        return res.json();
      })
      .then(checkinsData => {
        console.log('Checkins data received:', checkinsData);
        setCheckins(checkinsData);
      })
      .catch(err => {
        console.error('Error fetching checkins:', err);
      });
  };

  const addCheckIn = (message) => {
    if (!id) {
      alert('No project ID available');
      return;
    }
    
    fetch(`/api/projects/${id}/checkins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: localStorage.getItem('userId'), 
        type: 'check-in', 
        message 
      }),
    })
    .then(() => {
      fetchCheckins();
    })
    .catch(err => {
      console.error('Error adding checkin:', err);
      alert('Failed to add check-in');
    });
  };

  const handleCheckOut = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('You must be logged in to check out projects');
        return;
      }

      const response = await fetch(`/api/projects/${id}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Check out failed');
      }

      const result = await response.json();
      alert(result.message || 'Project checked out successfully');
      fetchProjectData();
      
    } catch (err) {
      console.error('Error checking out project:', err);
      alert(err.message);
    }
  };

  const handleDeleteProject = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      alert('Project deleted successfully');
      navigate('/home'); // Redirect to home page after deletion
      
    } catch (err) {
      console.error('Error deleting project:', err);
      alert(err.message);
    }
  };

  const isProjectOwner = () => {
    const userId = localStorage.getItem('userId');
    return project && project.ownerId === userId;
  };

  if (error) return (
    <div className="project-page">
      <Header />
      <div className="container">
        <div className="error text-center mt-5 p-4 bg-error-color text-white rounded-lg">
          Error: {error}
        </div>
      </div>
    </div>
  );

  if (!project) return (
    <div className="project-page">
      <Header />
      <div className="container">
        <div className="loading text-center mt-5">
          <div className="loading-spinner"></div>
          <p className="mt-2">Loading project {id}...</p>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'files':
        return <Files projectId={id} />;
      case 'messages':
        return <Messages projectId={id} />;
      case 'discussion':
        return <Discussion projectId={id} />;
      case 'issues':
        return <Issues projectId={id} />;
      case 'pull-requests':
        return <PullRequests projectId={id} />;
      case 'edit':
        return <EditProject 
          projectId={id} 
          name={project.name} 
          description={project.description} 
          onSave={fetchProjectData}
        />;
      default:
        return <Files projectId={id} />;
    }
  };

  return (
    <div className="project-page">
      <Header />
      <div className="container">
        <div className="project-content grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <main className="lg:col-span-2">
            <Project {...project} />
            
            {/* Project Actions */}
            <div className="project-actions flex flex-wrap gap-3 mb-6">
              {project.status !== 'checked-out' && (
                <button 
                  onClick={handleCheckOut}
                  className="btn-primary"
                >
                  Check Out Project
                </button>
              )}
              <button 
                onClick={() => {
                  const message = prompt('Enter check-in message:');
                  if (message) addCheckIn(message);
                }}
                className="btn-secondary"
              >
                Check In
              </button>
              
              {isProjectOwner() && (
                <>
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn-danger"
                  >
                    Delete Project
                  </button>
                </>
              )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="modal-content bg-card-bg rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                  <p className="text-secondary-text mb-6">
                    Are you sure you want to delete "{project.name}"? This action cannot be undone and will permanently remove all project data, files, and history.
                  </p>
                  <div className="modal-actions flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDeleteProject}
                      className="btn-danger"
                    >
                      Delete Project
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs Navigation */}
            <div className="tabs-navigation flex gap-1 mb-6 border-b border-border-color overflow-x-auto">
              {[
                { id: 'files', label: 'Files', icon: '📁' },
                { id: 'messages', label: 'Messages', icon: '💬' },
                { id: 'discussion', label: 'Discussion', icon: '💭' },
                { id: 'issues', label: 'Issues', icon: '🐛' },
                { id: 'pull-requests', label: 'Pull Requests', icon: '🔄' },
                { id: 'edit', label: 'Edit', icon: '✏️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-accent-color text-white' 
                      : 'bg-card-bg text-text-color hover:bg-border-color'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {renderTabContent()}
            </div>
          </main>
          
          <aside className="lg:col-span-1">
            <Stats projectId={id} />
            
            {/* Project Status Card */}
            <div className="status-card bg-card-bg rounded-lg shadow p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">Project Status</h3>
              <div className={`status-badge inline-block px-3 py-1 rounded-full text-sm ${
                project.status === 'checked-out' 
                  ? 'bg-error-color text-white' 
                  : 'bg-success-color text-white'
              }`}>
                {project.status === 'checked-out' ? 'Checked Out' : 'Available'}
              </div>
              {project.checkedOutBy && (
                <p className="text-sm text-secondary-text mt-2">
                  Checked out by: User {project.checkedOutBy}
                </p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="recent-activity bg-card-bg rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
              {checkins.length === 0 ? (
                <p className="text-secondary-text">No recent activity</p>
              ) : (
                <ul className="space-y-2">
                  {checkins.slice(0, 5).map((checkin, index) => (
                    <li key={index} className="text-sm border-l-2 border-accent-color pl-3">
                      <strong>{checkin.userName}:</strong> {checkin.message}
                      <br />
                      <span className="text-secondary-text text-xs">
                        {new Date(checkin.time).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;