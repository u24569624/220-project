import React, { useState, useEffect } from 'react';

const Stats = ({ projectId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/projects/${projectId}/stats`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then(data => setStats(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div>Loading stats...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No stats available</div>;

  return (
    <aside className="stats">
      <h3>About</h3>
      <p><strong>Description:</strong> {stats.description || 'Project description here'}</p>
      <p><strong>Last Commit:</strong> {stats.lastCommit || '2025-09-03 14:00'}</p>
      <p><strong>Tags:</strong> {stats.tags?.join(', ') || 'v1.0, beta'}</p>
      <p><strong>Recent Actions:</strong> {stats.recentActions?.join(', ') || 'Commit, Check-out'}</p>
      <p><strong>Contributors:</strong> {stats.contributors?.join(', ') || 'User1, User2'}</p>
    </aside>
  );
};

export default Stats;