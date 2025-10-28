import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import setAuthToken from '../utils/setAuthToken';

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

      const userRes = await axios.get(`${apiUrl}/api/auth`);
      setUser(userRes.data); 
      
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      console.error(err.response.data);
      alert('Login Failed: ' + (err.response.data.msg || 'Server Error'));
    }
  };

  return (
    // This is the new wrapper
    <div className="auth-page-container"> 
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={onSubmit} className="auth-form">
          <input type="email" name="email" placeholder="Email" onChange={onChange} required />
          <input type="password" name="password" placeholder="Password" onChange={onChange} required />
          <button type="submit">Login</button>
        </form>
        {/* New "switch to register" link */}
        <p className="auth-switch-link">
          New to LinkedIn? <Link to="/register">Join now</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

