import React from 'react';
import './styles/Home.css';
import {useNavigate} from 'react-router-dom';

const Home = () => {
  
  const navigate = useNavigate()

    const handleLogout = () => {
      // Logic for logout
      const token = localStorage.getItem('jwtToken')
      if(token){
        localStorage.removeItem('jwtToken')
      }
      navigate('/login')

      console.log('Logged out');
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