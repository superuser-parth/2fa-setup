import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {jwtDecode }from 'jwt-decode';

const checkAuth = () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    return false; // No token found
  }

  // Decode the token to extract expiration time
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

  // Check if the token has expired
  if (decodedToken.exp < currentTime) {
    // Token has expired
    return false;
  }

  // Token is valid
  return true;
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
