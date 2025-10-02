import React, { useState, useEffect } from 'react';
import Files from './Files';
import Issues from './Issues';
import PullRequests from './PullRequests';
import Stats from './Stats';

const Project = ({ id }) => {
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Code');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/projects/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch project');
        return res.json();
      })
      .then(data => setProject(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading project...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>No project data</div>;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Code':
        return <Files projectId={id} />;
      case 'Issues':
        return <Issues projectId={id} />;
      case 'Pull Requests':
        return <PullRequests />;
      case 'Settings':
        return <Stats />;
      default:
        return <p>Select a tab</p>;
    }
  };

  return (
    <article className="project">
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <div className="project-tabs">
        {['Code', 'Issues', 'Pull Requests', 'Settings'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </article>
  );
};

export default Project;