import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { email, password });
      login(res.data); // auto-login after register
      alert(`🎉 Welcome, ${res.data?.user?.name || res.data?.user?.email || 'User'}!`);
      navigate('/contacts');
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || 'Registration failed');
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
      <h2 style={headingStyle}>Register</h2>
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
          Register
        </button>
      </form>
      <p style={footerStyle}>
        Already have an account? <Link style={linkStyle} to="/login">Login</Link>
      </p>
    </div>
  );
}
