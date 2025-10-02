// CreateProject.js (new file)
import React, { useState } from 'react';

const CreateProject = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, description });
    setName(''); setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Project Name"
      />
      <input
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateProject;