import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';

const Navbar = ({ user, logout }) => {
  const [search, setSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implement search logic (e.g., navigate to /search?q=...)
    console.log('Search submitted:', search);
    setSearch('');
  };

  return (
    <nav className="navbar" id="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__logo" id="logo">
          <strong>LinkedIn</strong>
        </Link>
      </div>

      {user && (
        <div className="navbar__search">
          <form onSubmit={handleSearchSubmit} className="search-form" id="searchForm">
            <input
              type="text"
              className="search-input"
              id="searchInput"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="search-button" id="searchBtn" aria-label="Search">
              🔍
            </button>
          </form>
        </div>
      )}

      <div className="navbar__right">
        {user ? (
          <>
            <Link to={`/profile/${user._id}`} className="navbar__profile" id="profileLink">
              
              {/* --- THIS IS THE FIX --- */}
              {/* We must pass the 'name' prop for the initials to work */}
              <Avatar src={user.avatar} name={user.name} alt={user.name} />
              
              <span className="navbar__username">{user.name}</span>
            </Link>
            <button onClick={logout} className="navbar__logout" id="logoutBtn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__login" id="loginLink">Login</Link>
            <Link to="/register" className="navbar__register" id="registerLink">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

