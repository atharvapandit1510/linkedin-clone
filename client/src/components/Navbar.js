import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">LinkedIn-Clone</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          // This is the view for LOGGED-IN users
          <>
            <span className="navbar-user">Welcome, {user.name}</span>
            
            {/* THIS IS THE BUTTON YOU NEED TO ADD */}
            <button onClick={logout}> 
              Logout
            </button>
          </>
        ) : (
          // This is the view for GUESTS
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