import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/sidebar';
import Project from '../components/Project';
import Files from '../components/Files';
import Messages from '../components/Messages';
import Discussion from '../components/Discussion.js';
import EditProject from '../components/EditProject';
import Issues from '../components/Issues';
import PullRequests from '../components/PullRequests';
import Stats from '../components/Stats';

const ProjectPage = () => {
  return (
    <div className="project-page">
      <Header />
      <div className="main-content">
        <main>
          <Project />
          <div className="tabs">
            <Files />
            <Messages />
            <Discussion />
            <EditProject />
            <Issues />
            <PullRequests />
          </div>
        </main>
        <aside>
          <Stats />
        </aside>
      </div>
    </div>
  );
};

export default ProjectPage;