import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ContactList from './components/ContactList';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
    <div className="nav-left">
      <Link className="logo" to="/">Contact Book App</Link>
      {user && <Link className="nav-link" to="/contacts">Contacts</Link>}
    </div>

    <div className="nav-right">
      {user ? (
        <>
          <span className="user-email">{user.email}</span>
          <button className="btn logout" onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link className="btn" to="/login">Login</Link>
          <Link className="btn primary" to="/register">Register</Link>
        </>
      )}
    </div>
  </nav>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<div style={{padding:20}}>Welcome — use the app</div>} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/contacts" element={
            <ProtectedRoute><ContactList /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
