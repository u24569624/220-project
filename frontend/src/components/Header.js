import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar.js';
import { useDarkMode } from '../components/useDarkMode';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { theme, toggleTheme } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 2) {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        const data = await res.json();
        setSearchResults(data);
        setShowResults(true);
      } catch (err) {
        console.error('Search error:', err);
      }
    } else {
      setShowResults(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  const profileLink = userId ? `/profile/${userId}` : '/';

  return (
    <nav className="header-nav">
      <Sidebar />
      
      {/* Clickable Logo */}
      <Link to="/home" className="logo-link">
        <img src="/assets/images/Logo.png" alt="Logo" className="nav-logo" />
        <h1 className="site-title">Check This Out</h1>
      </Link>

      {/* Search with Results */}
      <div className="search-container">
        <input
          id="search"
          type="text"
          placeholder="Search users, projects, hashtags..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        {showResults && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((result, index) => (
              <Link 
                key={index} 
                to={result.type === 'user' ? `/profile/${result.id}` : `/project/${result.id}`}
                className="search-result-item"
                onClick={() => setShowResults(false)}
              >
                {result.type === 'user' ? '👤 ' : '📁 '}
                {result.name}
                {result.tags && result.tags.map(tag => (
                  <span key={tag} className="hashtag">#{tag}</span>
                ))}
              </Link>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={toggleTheme}
        className="theme-toggle btn btn-sm"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {userId ? (
        <div className="user-menu">
          <Link to={profileLink} className="profile-link">
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      ) : (
        <span className="material-symbols-outlined">account_circle</span>
      )}
    </nav>
  );
};

export default Header;