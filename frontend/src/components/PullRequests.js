import React, { useState, useEffect } from 'react';

const PullRequests = ({ projectId }) => {
  const [pulls, setPulls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/projects/${projectId}/pulls`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch pull requests');
        return res.json();
      })
      .then(data => setPulls(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div>Loading pull requests...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="pull-requests">
      <h2>Pull Requests</h2>
      <ul>
        {pulls.map((pr, index) => (
          <li key={index}>{pr}</li>
        ))}
      </ul>
    </section>
  );
};

export default PullRequests;