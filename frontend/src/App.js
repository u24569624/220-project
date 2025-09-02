import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React from 'react';
import Header from '../src/components/Header.js';
import SplashPage from './pages/SplashPage.js';
import ProfilePage from './pages/ProfilePage.js';
import ProjectPage from './pages/ProjectPage.js';
import HomePage from './pages/HomePage.js';

//<Route path="profile/:id" element={<ProfilePage/>} /> add for dynamic routing after

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<SplashPage/>} />
            <Route path="home" element={<HomePage />} />
            <Route path="profile/:id" element={<ProfilePage/>} />
            <Route path="project/:id" element={<ProjectPage/>} /> 
        </Routes>
    </Router>
);

export default App;