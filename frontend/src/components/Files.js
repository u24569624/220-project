import React, { useState, useEffect } from 'react';

const Files = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/projects/${projectId}/files`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch files');
        return res.json();
      })
      .then(data => setFiles(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleCheckOut = (file) => {
    fetch(`/api/projects/${projectId}/files/${file}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: localStorage.getItem('userId') }),
    })
      .then(res => {
        if (res.ok) alert(`Checked out ${file}`);
        else throw new Error('Check out failed');
      })
      .catch(err => alert(err.message));
  };

  if (loading) return <div>Loading files...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="files">
      <h2>File Explorer</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            {file}
            <button onClick={() => handleCheckOut(file)}>Check Out</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Files;