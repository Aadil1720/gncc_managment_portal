// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Check if we have a token in localStorage (in case context hasn't updated)
  const hasToken = localStorage.getItem('adminToken');
  
  return isAuthenticated || hasToken ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;