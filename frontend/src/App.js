import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProjectPage from './pages/ProjectPage';

// Correct import paths - all should start with ./
import './styles/global.css';
import './styles/layout.css';
import './styles/head.css'; 
import './styles/sidebar.css';
import './styles/Forms.css';
import './styles/components.css';
import './styles/feed.css';
import './styles/discussion.css';
import './styles/project-components.css';
import './styles/splash.css';
import './styles/responsive.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;