// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user session or token
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Logout;
