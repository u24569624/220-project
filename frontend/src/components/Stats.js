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
    fetch(`/projects/${projectId}/stats`)
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

  if (loading) return <div>Loading project stats...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No stats available</div>;

  return (
    <section className="stats">
      <h2>Project Statistics</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{stats.files || 0}</div>
          <div className="stat-label">Files</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.contributors || 0}</div>
          <div className="stat-label">Contributors</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.checkins || 0}</div>
          <div className="stat-label">Check-ins</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.issues || 0}</div>
          <div className="stat-label">Open Issues</div>
        </div>
      </div>
      {stats.lastUpdated && (
        <div className="last-updated">
          <small>Last updated: {new Date(stats.lastUpdated).toLocaleString()}</small>
        </div>
      )}
    </section>
  );
};

export default Stats;