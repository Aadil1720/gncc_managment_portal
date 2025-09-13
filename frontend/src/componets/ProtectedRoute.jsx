// // components/ProtectedRoute.js
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
  
//   // Check if we have a token in localStorage (in case context hasn't updated)
//   const hasToken = localStorage.getItem('adminToken');
  
//   return isAuthenticated || hasToken ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;

// components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  
  // Check if we have a token in localStorage (in case context hasn't updated)
  const hasToken = localStorage.getItem('adminToken');
  
  // If not authenticated and no token, redirect to login with return URL
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;