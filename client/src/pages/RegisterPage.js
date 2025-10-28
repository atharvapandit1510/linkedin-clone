import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import setAuthToken from '../utils/setAuthToken';

const RegisterPage = ({ apiUrl, setIsAuthenticated, setUser }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/register`, formData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);

      const userRes = await axios.get(`${apiUrl}/api/auth`);
      setUser(userRes.data);

      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      console.error(err.response.data);
      alert('Registration Failed: ' + (err.response.data.msg || 'Server Error'));
    }
  };

  return (
    // This is the new wrapper
    <div className="auth-page-container"> 
      <div className="form-container">
        <h2>Create Account</h2>
        <form onSubmit={onSubmit} className="auth-form">
          <input type="text" name="name" placeholder="Name" onChange={onChange} required />
          <input type="email" name="email" placeholder="Email" onChange={onChange} required />
          <input type="password" name="password" placeholder="Password (6+ characters)" minLength="6" onChange={onChange} required />
          <button type="submit">Register</button>
        </form>
         {/* New "switch to login" link */}
        <p className="auth-switch-link">
          Already on LinkedIn? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

