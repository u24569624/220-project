import React from 'react';
import Header from '../components/Header.js';
import LoginForm from '../components/LoginForm.js';
import SignUpForm from '../components/SignUpForm.js';
import {Link} from 'react-router-dom';
import '../styles/global.css';

const SplashPage = () => {
    return(
        <div>
            <nav>
                <img src="/assets/images/Logo.png" alt="Logo" ></img>
                <h1>Name</h1>
                {/*Temp links while endpoints are stubbed*/}
                <Link to="/home">Home</Link>
                <Link to="/project/456">Project</Link>
            </nav>

            <LoginForm />
            <SignUpForm />

            <div class="card">
                <h1>Smart Branching</h1>
                <p>Create, merge, and manage branches with an intuitive visual
                interface that makes complex workflows simple.</p>
            </div>

            <div class="card">
                <h1>Team Collaboration</h1>
                <p>Real-time collaboration tools, code reviews, 
                and merge requests that keep your team in sync.</p>
            </div>

        </div>
    );
};

export default SplashPage;