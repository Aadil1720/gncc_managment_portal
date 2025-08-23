// components/TokenRefresh.js
import React, { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import api from '../utils/api';

const TokenRefresh = () => {
  const { token, login } = useAuth();

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await api.post('/admin/refresh-token');
        const { token: newToken } = response.data;
        if (newToken) {
          login(newToken);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    };

    // Set up interval to refresh token before it expires
    const interval = setInterval(() => {
      if (token) {
        const decoded = parseJwt(token);
        if (decoded && decoded.exp) {
          const expirationTime = decoded.exp * 1000;
          const currentTime = Date.now();
          const bufferTime = 5 * 60 * 1000; // 5 minutes before expiration
          
          if (currentTime >= expirationTime - bufferTime) {
            refreshToken();
          }
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [token, login]);

  return null;
};

export default TokenRefresh;