import React from 'react';
import LoginForm from '../components/LoginForm.js';
import SignUpForm from '../components/SignUpForm.js';
import {Link} from 'react-router-dom';

const SplashPage = () => {
    return(
        <div>
            <nav>
                <img src="/assets/images/Logo.png" alt="Logo"/>
                <h1>Name</h1>
                <div>
                </div>
            </nav>
            <div>
                
            </div>

            <LoginForm />
            <SignUpForm />

            <div className="card">
                <h1>Smart Branching</h1>
                <p>Create, merge, and manage branches with an intuitive visual
                interface that makes complex workflows simple.</p>
            </div>

            <div className="card">
                <h1>Team Collaboration</h1>
                <p>Real-time collaboration tools, code reviews, 
                and merge requests that keep your team in sync.</p>
            </div>

            <div className="card">
                <h1>Enterprise Security</h1>
                <p>Bank-level security with SSO, two-factor authentication,
                     and granular permission controls.</p>
            </div>

            <div className="card">
                <h1>Lightning Fast</h1>
                <p>Optimized Git operations and global CDN ensure your
                 code is always accessible at blazing speeds.</p>
            </div>

            <div className="card">
                <h1>Rich Documentation</h1>
                <p>Integrated wikis, README rendering, and 
                project pages to keep your documentation current.</p>
            </div>

            <div className="card">
                <h1>Global Hosting</h1>
                <p>Deploy anywhere with integrated CI/CD pipelines
                     and hosting on our global infrastructure.</p>
            </div>

        </div>
    );
};

export default SplashPage;