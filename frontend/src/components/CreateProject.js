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
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Project Name"
        className="border p-2 w-full mb-2"
      />
      <input
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
        className="border p-2 w-full mb-2"
      />
      <button type="submit" className="bg-green-500 text-white p-2 w-full">Create</button>
    </form>
  );
};

export default CreateProject;