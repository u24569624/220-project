import React, { useState } from 'react';
import VersionHistory from './VersionHistory';

const EditProject = () => {
  const [description, setDescription] = useState('Project description here');

  return (
    <section className="edit-project">
      <h2>Edit Project</h2>
      <form>
        <label>
          Name:
          <input
            type="text"
            required
          />
        </label>
        <label>
          Description:
          <textarea
            required
          />
        </label>
        <button type="submit">Save</button>
      </form>
      <VersionHistory />
    </section>
  );
};

export default EditProject;