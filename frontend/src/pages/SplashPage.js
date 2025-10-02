import React from 'react';
import LoginForm from '../components/LoginForm.js';
import SignUpForm from '../components/SignUpForm.js';
import {Link} from 'react-router-dom';

const SplashPage = () => {
    return(
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white p-4 flex items-center shadow">
                <img src="/assets/images/Logo.png" alt="Logo" className="h-10" />
                <h1 className="ml-4 text-xl font-bold text-blue-600">Name</h1>
                <div className="ml-auto space-x-4">
                <Link to="/home" className="text-blue-500 hover:underline">Home</Link>
                <Link to="/project/456" className="text-blue-500 hover:underline">Project</Link>
                </div>
            </nav>
            <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                
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