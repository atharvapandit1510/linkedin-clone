import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import setAuthToken from '../utils/setAuthToken';

// Get setUser to update the user in App.js state on login
const LoginPage = ({ apiUrl, setIsAuthenticated, setUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);

      // After logging in, get the user data
      const userRes = await axios.get(`${apiUrl}/api/auth`);
      setUser(userRes.data); // Set user in App.js
      
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      console.error(err.response.data);
      alert('Login Failed: ' + (err.response.data.msg || 'Server Error'));
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <input type="email" name="email" placeholder="Email" onChange={onChange} required />
        <input type="password" name="password" placeholder="Password" onChange={onChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
