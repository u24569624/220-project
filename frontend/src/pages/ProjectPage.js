import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Project from '../components/Project';
import Files from '../components/Files';
import Messages from '../components/Messages';
import Discussion from '../components/Discussion';
import EditProject from '../components/EditProject';
import Issues from '../components/Issues';
import PullRequests from '../components/PullRequests';
import Stats from '../components/Stats';

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [error, setError] = useState(null);

  console.log('ProjectPage - Project ID from URL:', id);

  useEffect(() => {
    if (!id) {
      setError('No project ID provided');
      return;
    }

    // Fetch project data
    fetch(`/api/projects/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch project');
        return res.json();
      })
      .then(projectData => {
        console.log('Project data received:', projectData);
        setProject(projectData);
      })
      .catch(err => {
        console.error('Error fetching project:', err);
        setError(err.message);
      });

    // Fetch checkins
    fetch(`/api/projects/${id}/checkins`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch checkins');
        return res.json();
      })
      .then(checkinsData => {
        console.log('Checkins data received:', checkinsData);
        setCheckins(checkinsData);
      })
      .catch(err => {
        console.error('Error fetching checkins:', err);
      });
  }, [id]);

  const addCheckIn = (message) => {
    if (!id) {
      alert('No project ID available');
      return;
    }
    
    fetch(`/api/projects/${id}/checkins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: localStorage.getItem('userId'), 
        type: 'check-in', 
        message 
      }),
    })
    .then(() => {
      // Refresh checkins
      fetch(`/api/projects/${id}/checkins`)
        .then(res => res.json())
        .then(setCheckins);
    })
    .catch(err => {
      console.error('Error adding checkin:', err);
      alert('Failed to add check-in');
    });
  };

  if (error) return (
    <div className="project-page-container">
      <Header />
      <div className="error">Error: {error}</div>
    </div>
  );

  if (!project) return (
    <div className="project-page-container">
      <Header />
      <div>Loading project {id}...</div>
    </div>
  );

  return (
    <div className="project-page-container">
      <Header />
      <div className="project-content">
        <main>
          <Project {...project} />
          <div className="tabs">
            <Files projectId={id} />
            <Messages projectId={id} />
            <Discussion projectId={id} />
            <EditProject 
              projectId={id} 
              name={project.name} 
              description={project.description} 
              onSave={(updates) => {
                fetch(`/api/projects/${id}`, { 
                  method: 'PUT', 
                  headers: { 'Content-Type': 'application/json' }, 
                  body: JSON.stringify(updates) 
                });
              }} 
            />
            <Issues projectId={id} />
            <PullRequests projectId={id} />
          </div>
          <button onClick={() => {
            const message = prompt('Enter check-in message:');
            if (message) addCheckIn(message);
          }}>
            Check In
          </button>
        </main>
        <aside>
          <Stats projectId={id} />
        </aside>
      </div>
    </div>
  );
};

export default ProjectPage;