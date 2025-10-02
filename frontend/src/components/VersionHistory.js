import React, { useState, useEffect } from 'react';

const VersionHistory = ({ projectId }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/projects/${projectId}/versions`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch versions');
        return res.json();
      })
      .then(data => setVersions(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleRollback = (version) => {
    fetch(`/api/projects/${projectId}/versions/${version}`, {
      method: 'POST',
    })
      .then(res => {
        if (res.ok) alert(`Rolled back to ${version}`);
        else throw new Error('Rollback failed');
      })
      .catch(err => alert(err.message));
  };

  if (loading) return <div>Loading versions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="version-history">
      <h3>Version History</h3>
      <ul>
        {versions.map((version, index) => (
          <li key={index}>
            {version}
            <button onClick={() => handleRollback(version)}>Rollback</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default VersionHistory;