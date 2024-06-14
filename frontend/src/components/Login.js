import React, { useState } from 'react';
import './styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import '../lib/firebase'

const Login = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(''); 
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth()

//Need to pump up the contributions

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate('/mfa');
  } catch (error) {
    setError(error.message); // Set the error message
    console.error('Error logging in:', error);
  }
};

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Conditionally render error message */}
      </form>
      <Link to="/signup" className="text-blue-500 hover:underline">New User? Sign Up</Link>
    </div>
  );
};

export default Login;
