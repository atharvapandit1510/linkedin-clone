import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage
import setAuthToken from './utils/setAuthToken';
import axios from 'axios';

const API_URL = 'http://localhost:5000'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        try {
          const res = await axios.get(`${API_URL}/api/auth`);
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Auth error', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '5rem', fontSize: '1.5rem' }}>Loading Application...</div>;
  }

  return (
    <Router>
      {/* Pass user to Navbar for search and profile link */}
      <Navbar user={user} logout={logout} />
      <div className="container">
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
          {/* --- ADD THIS ROUTE --- */}
          <Route 
            path="/profile/:userId"
            element={
              isAuthenticated ? (
                // Pass the logged-in user as 'currentUser'
                <ProfilePage apiUrl={API_URL} currentUser={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* --- END ROUTE --- */}

          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage apiUrl={API_URL} setIsAuthenticated={setIsAuthenticated} setUser={setUser} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <RegisterPage apiUrl={API_URL} setIsAuthenticated={setIsAuthenticated} setUser={setUser} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

