import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import setAuthToken from '../utils/setAuthToken';

const LoginPage = ({ apiUrl, setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, formData);
      localStorage.setItem('token', res.data.token); // Store token
      setAuthToken(res.data.token); // Set token in headers
      setIsAuthenticated(true);
      navigate('/'); // Redirect to home
    } catch (err) {
      console.error(err.response.data);
      alert('Login Failed: ' + err.response.data.msg);
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