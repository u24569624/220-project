import React, { useState } from 'react';
import VersionHistory from './VersionHistory';

const EditProject = ({ projectId, name: initialName, description: initialDescription, onSave }) => {
  const [name, setName] = useState(initialName || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [hashtags, setHashtags] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const updates = { name, description };
    if (hashtags) updates.hashtags = hashtags.split(',').map(tag => tag.trim());
    if (type) updates.type = type;

    fetch(`/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update project');
        return res.json();
      })
      .then(() => {
        setSuccess(true);
        if (onSave) onSave(updates);
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <section className="edit-project-section">
      <div className="section-header mb-6">
        <h2 className="text-2xl font-bold">Edit Project</h2>
        <p className="text-secondary-text">Update project details and settings</p>
      </div>

      {error && (
        <div className="error-message card bg-error-color/10 border-error-color text-error-color p-4 mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message card bg-success-color/10 border-success-color text-success-color p-4 mb-6">
          Project updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-project-form card">
        <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="form-input"
            >
              <option value="">Select type...</option>
              <option value="web-application">Web Application</option>
              <option value="mobile-app">Mobile App</option>
              <option value="desktop-app">Desktop Application</option>
              <option value="library">Library</option>
              <option value="framework">Framework</option>
              <option value="api">API</option>
            </select>
          </div>

          <div className="form-group md:col-span-2">
            <label className="form-label">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows="4"
              required
            />
          </div>

          <div className="form-group md:col-span-2">
            <label className="form-label">Hashtags</label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="form-input"
              placeholder="javascript, react, nodejs (comma separated)"
            />
            <div className="form-help-text">
              Separate tags with commas. These will be converted to hashtags.
            </div>
          </div>
        </div>

        <div className="form-actions flex gap-2 justify-end mt-6">
          <button 
            type="button" 
            onClick={() => {
              setName(initialName || '');
              setDescription(initialDescription || '');
              setHashtags('');
              setType('');
            }}
            className="btn-outline"
          >
            Reset
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <VersionHistory projectId={projectId} />
      </div>
    </section>
  );
};

export default EditProject;