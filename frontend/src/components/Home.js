import React from 'react';
import './styles/Home.css';
import {useNavigate} from 'react-router-dom';

const Home = () => {
  
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4444/api/logout', {
        method: 'POST',
        credentials: 'include' // Ensure cookies are sent with the request
      });
  
      if (response.ok) {
        navigate('/login');
        console.log('Logged out');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
    return (
      <div className="home-container">
        <h1>Welcome to Home Page</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    );
  };
  
  export default Home;