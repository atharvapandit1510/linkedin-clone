import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import setAuthToken from './utils/setAuthToken';
import axios from 'axios';

// This is your DEPLOYED backend URL.
// For local testing, use: 'http://localhost:5000'
const API_URL = 'http://localhost:5000'; // <-- CHANGE THIS LATER

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar user={user} logout={logout} />
      <div className="container" style={{ padding: '20px' }}>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <HomePage apiUrl={API_URL} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage apiUrl={API_URL} setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <RegisterPage apiUrl={API_URL} setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;