import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar.js';
import { useDarkMode } from '../components/useDarkMode';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const { theme, toggleTheme } = useDarkMode();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) setUserId(storedUserId);

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchError(null);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (term.trim().length > 1) {
      setIsSearching(true);
      
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          console.log('Searching for:', term);
          const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
          
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Search API not found. Please check server routes.');
            }
            throw new Error(`Search failed with status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Search results:', data);
          setSearchResults(data);
          setShowResults(true);
        } catch (err) {
          console.error('Search error:', err);
          setSearchError(err.message);
          setSearchResults([]);
          setShowResults(true);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setShowResults(false);
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchTerm('');
    setSearchResults([]);
    
    if (result.type === 'user') {
      navigate(`/profile/${result.id}`);
    } else if (result.type === 'project') {
      navigate(`/project/${result.id}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const profileLink = userId ? `/profile/${userId}` : '/';

  return (
    <nav className="header-nav">
      <Sidebar />
      
      <Link to="/home" className="logo-link">
        <img src="/assets/images/Logo.png" alt="Logo" className="nav-logo" />
        <h1 className="site-title">Check This Out</h1>
      </Link>

      <div className="search-container" ref={searchRef}>
        <input
          id="search"
          type="text"
          placeholder="Search users by name, username, or email..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => searchTerm.trim().length > 1 && setShowResults(true)}
          className="search-input"
          aria-label="Search users and projects"
        />
        
        {isSearching && (
          <div className="search-loading">
            <div className="loading-spinner-small"></div>
          </div>
        )}

        {showResults && (
          <div className="search-results-dropdown">
            {searchError ? (
              <div className="search-result-item error-result">
                <div className="error-icon">⚠️</div>
                <div className="error-message">
                  <strong>Search unavailable</strong>
                  <div className="error-details">{searchError}</div>
                </div>
              </div>
            ) : searchResults.length === 0 && !isSearching ? (
              <div className="search-result-item no-results">
                No results found for "{searchTerm}"
              </div>
            ) : (
              <>
                {searchResults.filter(r => r.type === 'user').length > 0 && (
                  <div className="search-category">
                    <h4>Users</h4>
                    {searchResults.filter(r => r.type === 'user').map((result, index) => (
                      <div 
                        key={`user-${result.id}-${index}`} 
                        className="search-result-item user-result"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="result-avatar">
                          {result.avatar ? (
                            <img src={result.avatar} alt={result.displayName} />
                          ) : (
                            <div className="avatar-placeholder-small">
                              {result.displayName ? result.displayName.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                        </div>
                        <div className="result-info">
                          <div className="result-name">{result.displayName}</div>
                          <div className="result-details">
                            {result.username && `@${result.username}`}
                            {result.email && result.username && ' • '}
                            {result.email && result.email}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.filter(r => r.type === 'project').length > 0 && (
                  <div className="search-category">
                    <h4>Projects</h4>
                    {searchResults.filter(r => r.type === 'project').map((result, index) => (
                      <div 
                        key={`project-${result.id}-${index}`} 
                        className="search-result-item project-result"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="result-icon">📁</div>
                        <div className="result-info">
                          <div className="result-name">{result.name}</div>
                          <div className="result-details">
                            {result.description ? 
                              result.description.substring(0, 60) + '...' : 
                              'No description'
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <button
        onClick={toggleTheme}
        className="theme-toggle btn btn-sm"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {userId ? (
        <div className="user-menu">
          <Link to={profileLink} className="profile-link" title="Your Profile">
            <span className="material-symbols-outlined">account_circle</span>
            <span className="user-name">Profile</span>
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      ) : (
        <Link to="/" className="profile-link">
          <span className="material-symbols-outlined">account_circle</span>
        </Link>
      )}
    </nav>
  );
};

export default Header;