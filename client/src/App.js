import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage
import setAuthToken from './utils/setAuthToken';
import axios from 'axios';

// This is your DEPLOYED backend URL.
// For local testing, use: 'http://localhost:5000'
const API_URL = 'http://localhost:5000'; // <-- CHANGE THIS LATER

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- THE NEW LOADING STATE

  // Check for token and load user
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        try {
          // Get user data
          const res = await axios.get(`${API_URL}/api/auth`);
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Auth error', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false); // <-- Set loading to false AFTER auth check is done
    };
    loadUser();
  }, []);

  // Simple logout
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  // --- THIS IS THE FIX ---
  // Show a loading spinner for the whole app until the user is loaded.
  // This guarantees 'user' is correctly set before any page renders.
  if (loading) {
    return <div className="feed-loading">Loading Application...</div>;
  }

  return (
    <Router>
      <Navbar user={user} logout={logout} />
      <div className="container" style={{ padding: '0px' }}> {/* Removed padding to allow full-width components */}
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <HomePage apiUrl={API_URL} user={user} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/profile/:userId"
            element={
              isAuthenticated ? (
                <ProfilePage apiUrl={API_URL} currentUser={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <LoginPage apiUrl={API_URL} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              !isAuthenticated ? (
                <RegisterPage apiUrl={API_URL} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

