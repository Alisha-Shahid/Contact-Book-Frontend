import React, { useState, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data);
      navigate('/contacts');
      alert(`🎉 Welcome, ${res.data?.user?.name || res.data?.user?.email || 'User'}!`);
    } catch (errs) {
      console.log(errs);
      alert(errs.response?.data?.message || 'Login failed');
    }
  };

  const containerStyle = {
    maxWidth: '400px',
    margin: '3rem auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    background: '#fff',
    fontFamily: 'sans-serif',
  };

  const headingStyle = {
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    background: '#4a90e2',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  const linkStyle = {
    color: '#4a90e2',
    textDecoration: 'none',
  };

  const footerStyle = {
    marginTop: '1rem',
    fontSize: '14px',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Login</h2>
      <form onSubmit={submit}>
        <input
          style={inputStyle}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={inputStyle}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button style={buttonStyle} type="submit">
          Login
        </button>
      </form>
      <p style={footerStyle}>
        Don't have an account? <Link style={linkStyle} to="/register">Register</Link>
      </p>
    </div>
  );
}
