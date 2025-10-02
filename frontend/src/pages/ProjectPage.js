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

  useEffect(() => {
    fetch(`/api/projects/${id}`).then(res => res.json()).then(setProject);
    fetch(`/api/projects/${id}/checkins`).then(res => res.json()).then(setCheckins);
  }, [id]);

  const addCheckIn = (message) => {
    fetch(`/api/projects/${id}/checkins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: localStorage.getItem('userId'), type: 'check-in', message }),
    }).then(() => fetch(`/api/projects/${id}/checkins`).then(res => res.json()).then(setCheckins));
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="project-page">
      <Header />
      <main>
        <Project {...project} />
        <div className="tabs">
          <Files />
          <Messages checkins={checkins} />
          <Discussion />
          <EditProject onSave={(updates) => {
            fetch(`/api/projects/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
          }} />
          <Issues />
          <PullRequests />
        </div>
        <button onClick={() => addCheckIn(prompt('Message'))}>Check In</button>
      </main>
      <aside><Stats /></aside>
    </div>
  );
};

export default ProjectPage;