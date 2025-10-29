import React, { useState, useEffect } from 'react';

const Issues = ({ projectId }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    console.log('Issues - Fetching for project:', projectId);
    
    setLoading(true);
    fetch(`/projects/${projectId}/issues`)
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

  if (loading) return <div>Loading issues...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="issues">
      <h2>Issues</h2>
      {issues.length === 0 ? (
        <p>No issues found for this project.</p>
      ) : (
        <ul>
          {issues.map((issue, index) => (
            <li key={index}>{issue.title || issue}</li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Issues;