import React, { useState, useEffect } from 'react';

const Issues = ({ projectId }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newIssue, setNewIssue] = useState({ title: '', description: '', priority: 'medium' });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    console.log('Issues - Fetching for project:', projectId);
    
    setLoading(true);
    fetch(`/api/projects/${projectId}/issues`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch issues: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Issues data received:', data);
        setIssues(data);
      })
      .catch(err => {
        console.error('Error fetching issues:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!newIssue.title.trim()) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newIssue,
          userId: localStorage.getItem('userId'),
          userName: localStorage.getItem('userName') || 'User'
        }),
      });

      if (!response.ok) throw new Error('Failed to create issue');

      const createdIssue = await response.json();
      setIssues(prev => [createdIssue, ...prev]);
      setNewIssue({ title: '', description: '', priority: 'medium' });
      setShowCreateForm(false);
      
    } catch (err) {
      console.error('Error creating issue:', err);
      alert('Failed to create issue');
    }
  };

  const handleCloseIssue = async (issueId) => {
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'closed' }),
      });

      if (!response.ok) throw new Error('Failed to close issue');

      setIssues(prev => prev.map(issue => 
        issue._id === issueId ? { ...issue, status: 'closed' } : issue
      ));
      
    } catch (err) {
      console.error('Error closing issue:', err);
      alert('Failed to close issue');
    }
  };

  if (loading) return (
    <div className="issues-section">
      <div className="loading flex items-center justify-center p-8">
        <div className="loading-spinner"></div>
        <span className="ml-2">Loading issues...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="issues-section">
      <div className="error text-error text-center p-4 bg-card-bg rounded-lg shadow">
        Error: {error}
      </div>
    </div>
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error-color';
      case 'medium': return 'bg-warning-color';
      case 'low': return 'bg-success-color';
      default: return 'bg-secondary-text';
    }
  };

  return (
    <section className="issues-section">
      <div className="section-header flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Issues</h2>
          <p className="text-secondary-text">Track and manage project issues</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          Create Issue
        </button>
      </div>

      {/* Create Issue Form */}
      {showCreateForm && (
        <div className="create-issue-form bg-card-bg rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Create New Issue</h3>
          <form onSubmit={handleCreateIssue} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-color mb-2">
                Title *
              </label>
              <input
                type="text"
                value={newIssue.title}
                onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                className="input-field w-full"
                placeholder="Enter issue title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-color mb-2">
                Description
              </label>
              <textarea
                value={newIssue.description}
                onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                className="input-field w-full h-24"
                placeholder="Describe the issue..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-color mb-2">
                Priority
              </label>
              <select
                value={newIssue.priority}
                onChange={(e) => setNewIssue({...newIssue, priority: e.target.value})}
                className="input-field w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                Create Issue
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

      {issues.length === 0 ? (
        <div className="empty-state text-center py-12 bg-card-bg rounded-lg shadow">
          <div className="text-6xl mb-4">🐛</div>
          <h3 className="text-xl font-semibold mb-2">No issues found</h3>
          <p className="text-secondary-text">Create the first issue to get started</p>
        </div>
      ) : (
        <div className="issues-list space-y-4">
          {issues.map((issue, index) => (
            <div key={issue._id || index} className={`issue-item bg-card-bg rounded-lg shadow p-4 border-l-4 ${
              issue.status === 'closed' ? 'border-success-color' : 'border-accent-color'
            }`}>
              <div className="issue-header flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className={`priority-dot w-3 h-3 rounded-full ${getPriorityColor(issue.priority)}`}></span>
                  <h3 className="issue-title text-lg font-semibold text-text-color">
                    {issue.title || `Issue #${index + 1}`}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`status-badge px-2 py-1 rounded text-xs ${
                    issue.status === 'closed' 
                      ? 'bg-success-color text-white' 
                      : 'bg-accent-color text-white'
                  }`}>
                    {issue.status || 'open'}
                  </span>
                  {issue.status !== 'closed' && (
                    <button 
                      onClick={() => handleCloseIssue(issue._id)}
                      className="btn-success text-xs"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
              
              {issue.description && (
                <p className="issue-description text-secondary-text mb-3">
                  {issue.description}
                </p>
              )}
              
              <div className="issue-meta flex justify-between items-center text-sm text-secondary-text">
                <div className="flex items-center gap-4">
                  {issue.author && (
                    <span>By: {issue.author}</span>
                  )}
                  {issue.createdAt && (
                    <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`priority-badge px-2 py-1 rounded text-xs ${
                    getPriorityColor(issue.priority)
                  } text-white`}>
                    {issue.priority} priority
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Issues;