import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';

const Navbar = ({ user, logout }) => {
  const [search, setSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement search logic
    // 1. Create a /search?q=... page
    // 2. Navigate to it: navigate(`/search?q=${search}`)
    // 3. That page will call a new API endpoint: /api/search?q=...
    console.log('Search submitted:', search);
    setSearch('');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          {/* Link logo to home */}
          <Link to="/">L</Link> 
        </div>
        {/* --- ADD SEARCH BAR --- */}
        {user && (
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        )}
        {/* --- END SEARCH BAR --- */}
      </div>

      <div className="navbar-links">
        {user ? (
          <>
            {/* Link avatar/name to profile */}
            <Link to={`/profile/${user._id}`} className="navbar-user-link">
              <div className="navbar-user">
                <Avatar name={user.name} />
                <span>{user.name}</span>
              </div>
            </Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

