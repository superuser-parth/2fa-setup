import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {jwtDecode }from 'jwt-decode';

const checkAuth = async () => {
  try {
    const response = await fetch('http://localhost:4444/api/protected', {
      method: 'GET',
      credentials: 'include', // Ensure cookies are sent with the request
    });
    return response.status === 200; // Authentication successful
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false; // Authentication failed
  }
};




const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoute;
