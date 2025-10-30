import React, { useState, useEffect } from 'react';

const Stats = ({ projectId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    console.log('Stats - Fetching for project:', projectId);
    
    setLoading(true);
    fetch(`/api/projects/${projectId}/stats`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Stats data received:', data);
        setStats(data);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return (
    <div className="stats-section">
      <div className="loading flex items-center justify-center p-8">
        <div className="loading-spinner"></div>
        <span className="ml-2">Loading project stats...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="stats-section">
      <div className="error text-error text-center p-4 bg-card-bg rounded-lg shadow">
        Error: {error}
      </div>
    </div>
  );
  
  if (!stats) return (
    <div className="stats-section">
      <div className="empty-state text-center p-6 bg-card-bg rounded-lg shadow">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-secondary-text">No stats available</p>
      </div>
    </div>
  );

  return (
    <section className="stats-section">
      <div className="section-header mb-6">
        <h2 className="text-2xl font-bold">Project Statistics</h2>
      </div>
      
      <div className="stats-grid grid grid-cols-2 gap-4 mb-6">
        <div className="stat-item card text-center p-4">
          <div className="stat-value text-2xl font-bold text-accent-color">
            {stats.files || 0}
          </div>
          <div className="stat-label text-secondary-text">Files</div>
        </div>
        <div className="stat-item card text-center p-4">
          <div className="stat-value text-2xl font-bold text-accent-color">
            {stats.contributors || 0}
          </div>
          <div className="stat-label text-secondary-text">Contributors</div>
        </div>
        <div className="stat-item card text-center p-4">
          <div className="stat-value text-2xl font-bold text-accent-color">
            {stats.checkins || 0}
          </div>
          <div className="stat-label text-secondary-text">Check-ins</div>
        </div>
        <div className="stat-item card text-center p-4">
          <div className="stat-value text-2xl font-bold text-accent-color">
            {stats.issues || 0}
          </div>
          <div className="stat-label text-secondary-text">Open Issues</div>
        </div>
      </div>
      
      {stats.lastUpdated && (
        <div className="last-updated text-center text-secondary-text text-sm">
          Last updated: {new Date(stats.lastUpdated).toLocaleString()}
        </div>
      )}
    </section>
  );
};

export default Stats;