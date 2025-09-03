import React from 'react';
import {useState} from 'react';
import CreateProject from './CreateProject';
import '../styles/RepoList.css';

//will be a side bar

const RepositoryList = () => {
    //Dummy Data
    const repo = [
        {id: 1, name: 'Repo 1', description: 'First project repository'},
        {id: 2, name: 'Repo 2', description: 'Team collaboration project'},
        {id: 3, name: 'Repo 3', description: 'Personal coding experiment'},
    ];

    return (
    <section className="repository-list">
      <h2>Repositories</h2>
        <CreateProject/>
      <div className="repository-controls">
        <input
          type="text"
          placeholder="Filter repositories..."
          className="filter-input"
        />
        <button className="add-button">
          Add
        </button>
      </div>
      <ul className="repo-list">
        {repo.map(repo => (
          <li key={repo.id} className="repo-item">
            {repo.name} - {repo.description}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RepositoryList;