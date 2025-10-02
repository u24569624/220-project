import React, { useState } from 'react';
import VersionHistory from './VersionHistory';

const EditProject = ({ projectId, name: initialName, description: initialDescription, onSave }) => {
  const [name, setName] = useState(initialName || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update project');
        return res.json();
      })
      .then(() => {
        if (onSave) onSave({ name, description });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <section className="edit-project">
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>Save</button>
      </form>
      <VersionHistory projectId={projectId} />
    </section>
  );
};

export default EditProject;