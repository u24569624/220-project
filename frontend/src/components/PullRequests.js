import React, { useState, useEffect } from 'react';

const PullRequests = ({ projectId }) => {
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    console.log('PullRequests - Fetching for project:', projectId);
    
    setLoading(true);
    // REMOVE /api from the URL
    fetch(`/projects/${projectId}/pulls`)
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

  if (loading) return <div>Loading pull requests...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="pull-requests">
      <h2>Pull Requests</h2>
      {pullRequests.length === 0 ? (
        <div className="no-pull-requests">
          <p>No pull requests found for this project.</p>
          <p><small>Pull requests will appear here when team members submit code changes for review.</small></p>
        </div>
      ) : (
        <ul className="pull-request-list">
          {pullRequests.map((pr, index) => (
            <li key={pr._id || pr.id || index} className="pull-request-item">
              <div className="pull-request-header">
                <strong>{pr.title || `PR #${index + 1}`}</strong>
                <span className={`pr-status ${pr.status || 'open'}`}>
                  {pr.status || 'Open'}
                </span>
              </div>
              {pr.description && (
                <p className="pr-description">{pr.description}</p>
              )}
              <div className="pr-meta">
                {pr.author && <span>By: {pr.author}</span>}
                {pr.createdAt && (
                  <span>Created: {new Date(pr.createdAt).toLocaleDateString()}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PullRequests;