import React from 'react';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';
import '../styles/splash.css';

const SplashPage = () => {
  return (
    <div className="splash-page">

      {/* Navigation */}
      <nav className="navbar">
        <img src="/assets/images/Logo.png" alt="Logo" className="logo" />
        <h1 className="site-title">Check This Out</h1>
      </nav>

      {/* Hero */}
      <section className="hero">
        <h2>Version Control Simplified</h2>
        <p>
          Collaborate, branch, and deploy your code effortlessly —
          built for developers and teams who value speed and simplicity.
        </p>
      </section>

      {/* Auth Triggers */}
      <section className="auth-section">
        <div className="login-signup">
          <LoginForm />
          <SignUpForm />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="features">
        <div className="card">
          <h3>Smart Branching</h3>
          <p>Create, merge, and manage branches with an intuitive visual interface that makes complex workflows simple.</p>
        </div>
        <div className="card">
          <h3>Team Collaboration</h3>
          <p>Real-time collaboration tools, code reviews, and merge requests that keep your team in sync.</p>
        </div>
        <div className="card">
          <h3>Enterprise Security</h3>
          <p>Bank-level security with SSO, two-factor authentication, and granular permission controls.</p>
        </div>
        <div className="card">
          <h3>Lightning Fast</h3>
          <p>Optimized Git operations and global CDN ensure your code is always accessible at blazing speeds.</p>
        </div>
        <div className="card">
          <h3>Rich Documentation</h3>
          <p>Integrated wikis, README rendering, and project pages to keep your documentation current.</p>
        </div>
        <div className="card">
          <h3>Global Hosting</h3>
          <p>Deploy anywhere with integrated CI/CD pipelines and hosting on our global infrastructure.</p>
        </div>
      </section>

    </div>
  );
};

export default SplashPage;