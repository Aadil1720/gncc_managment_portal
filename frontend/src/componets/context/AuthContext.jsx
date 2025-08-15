import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Helper to decode token payload (optional)
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
  const [adminInfo, setAdminInfo] = useState(() => (token ? parseJwt(token) : null));

  // Save token and admin info on login
  const login = (jwtToken) => {
    localStorage.setItem('adminToken', jwtToken);
    setToken(jwtToken);
    setAdminInfo(parseJwt(jwtToken));
  };

  // Remove token on logout
  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setAdminInfo(null);
  };

  // Check if token is valid / exists
  const isAuthenticated = Boolean(token);

  // Optional: auto logout if token expired (based on exp claim)
  useEffect(() => {
    if (token) {
      const { exp } = parseJwt(token) || {};
      if (exp && Date.now() >= exp * 1000) {
        logout();
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        adminInfo,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier access
export const useAuth = () => useContext(AuthContext);
