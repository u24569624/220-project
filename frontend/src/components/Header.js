import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar.js';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState(null); // Hypothetical user ID state

  // Simulate fetching user ID (replace with actual auth logic)
  useEffect(() => {
    // Example: Get userId from localStorage or context after login
    const storedUserId = localStorage.getItem('userId'); // Adjust based on your auth setup
    if (storedUserId) setUserId(storedUserId);
  }, []);

  // Temp search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Redirect to profile only if userId is available
  const profileLink = userId ? `/profile/${userId}` : '/';

  return (
    <nav>
      <Sidebar />
      <img src="/assets/images/Logo.png" alt="Logo" />
      <h1>Name</h1>
      <input
        id="search"
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearch}
      />
      {userId ? (
        <Link to={profileLink}>
          <span className="material-symbols-outlined">account_circle</span>
        </Link>
      ) : (
        <span className="material-symbols-outlined">account_circle</span> // Placeholder if not logged in
      )}
    </nav>
  );
};

export default Header;