import React, { useState, useEffect } from 'react';

const PullRequests = ({ projectId }) => {
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPR, setNewPR] = useState({ title: '', description: '', branch: 'main' });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    console.log('PullRequests - Fetching for project:', projectId);
    
    setLoading(true);
    fetch(`/api/projects/${projectId}/pulls`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch pull requests: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Pull requests data received:', data);
        setPullRequests(data);
      })
      .catch(err => {
        console.error('Error fetching pull requests:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleCreatePR = async (e) => {
    e.preventDefault();
    if (!newPR.title.trim()) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/pulls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPR,
          userId: localStorage.getItem('userId'),
          userName: localStorage.getItem('userName') || 'User',
          status: 'open'
        }),
      });

      if (!response.ok) throw new Error('Failed to create pull request');

      const createdPR = await response.json();
      setPullRequests(prev => [createdPR, ...prev]);
      setNewPR({ title: '', description: '', branch: 'main' });
      setShowCreateForm(false);
      
    } catch (err) {
      console.error('Error creating pull request:', err);
      alert('Failed to create pull request');
    }
  };

  const handleMergePR = async (prId) => {
    try {
      const response = await fetch(`/api/pulls/${prId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'merged' }),
      });

      if (!response.ok) throw new Error('Failed to merge pull request');

      setPullRequests(prev => prev.map(pr => 
        pr._id === prId ? { ...pr, status: 'merged' } : pr
      ));
      
    } catch (err) {
      console.error('Error merging pull request:', err);
      alert('Failed to merge pull request');
    }
  };

  if (loading) return (
    <div className="pull-requests-section">
      <div className="loading flex items-center justify-center p-8">
        <div className="loading-spinner"></div>
        <span className="ml-2">Loading pull requests...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="pull-requests-section">
      <div className="error text-error text-center p-4 bg-card-bg rounded-lg shadow">
        Error: {error}
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'merged': return 'bg-success-color';
      case 'closed': return 'bg-error-color';
      case 'open': return 'bg-accent-color';
      default: return 'bg-secondary-text';
    }
  };

  return (
    <section className="pull-requests-section">
      <div className="section-header flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Pull Requests</h2>
          <p className="text-secondary-text">Review and merge code changes</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          Create Pull Request
        </button>
      </div>

      {/* Create PR Form */}
      {showCreateForm && (
        <div className="create-pr-form bg-card-bg rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Create New Pull Request</h3>
          <form onSubmit={handleCreatePR} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-color mb-2">
                Title *
              </label>
              <input
                type="text"
                value={newPR.title}
                onChange={(e) => setNewPR({...newPR, title: e.target.value})}
                className="input-field w-full"
                placeholder="Enter pull request title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-color mb-2">
                Description
              </label>
              <textarea
                value={newPR.description}
                onChange={(e) => setNewPR({...newPR, description: e.target.value})}
                className="input-field w-full h-24"
                placeholder="Describe the changes..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-color mb-2">
                Branch
              </label>
              <input
                type="text"
                value={newPR.branch}
                onChange={(e) => setNewPR({...newPR, branch: e.target.value})}
                className="input-field w-full"
                placeholder="Branch name"
              />
            </div>
            
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                Create Pull Request
              </button>
              <button 
                type="button" 
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {pullRequests.length === 0 ? (
        <div className="empty-state text-center py-12 bg-card-bg rounded-lg shadow">
          <div className="text-6xl mb-4">🔄</div>
          <h3 className="text-xl font-semibold mb-2">No pull requests found</h3>
          <p className="text-secondary-text mb-4">Pull requests will appear here when team members submit code changes for review.</p>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create First Pull Request
          </button>
        </div>
      ) : (
        <div className="pull-request-list space-y-4">
          {pullRequests.map((pr, index) => (
            <div key={pr._id || pr.id || index} className="pull-request-item bg-card-bg rounded-lg shadow p-4 border-l-4 border-accent-color">
              <div className="pull-request-header flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-text-color mb-1">
                    {pr.title || `PR #${index + 1}`}
                  </h3>
                  {pr.branch && (
                    <div className="branch-info text-sm text-secondary-text">
                      Branch: <code className="bg-border-color px-1 rounded">{pr.branch}</code>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`pr-status px-2 py-1 rounded text-xs ${getStatusColor(pr.status)} text-white`}>
                    {pr.status || 'Open'}
                  </span>
                  {pr.status === 'open' && (
                    <button 
                      onClick={() => handleMergePR(pr._id)}
                      className="btn-success text-xs"
                    >
                      Merge
                    </button>
                  )}
                </div>
              </div>
              
              {pr.description && (
                <p className="pr-description text-secondary-text mb-3">
                  {pr.description}
                </p>
              )}
              
              <div className="pr-meta flex justify-between items-center text-sm text-secondary-text">
                <div className="flex items-center gap-4">
                  {pr.author && (
                    <span>By: {pr.author}</span>
                  )}
                  {pr.createdAt && (
                    <span>Created: {new Date(pr.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {pr.commits && (
                    <span>{pr.commits} commits</span>
                  )}
                  {pr.changes && (
                    <span>{pr.changes} changes</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PullRequests;