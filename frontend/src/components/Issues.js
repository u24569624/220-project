import React, { useState, useEffect } from 'react';

const Issues = ({ projectId }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/projects/${projectId}/issues`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch issues');
        return res.json();
      })
      .then(data => setIssues(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div>Loading issues...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="issues">
      <h2>Issues</h2>
      <ul>
        {issues.map((issue, index) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
    </section>
  );
};

export default Issues;