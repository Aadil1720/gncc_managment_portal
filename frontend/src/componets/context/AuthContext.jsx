// import React, { createContext, useContext, useState, useEffect } from 'react';

// // Create context
// const AuthContext = createContext();

// // Helper to decode token payload (optional)
// const parseJwt = (token) => {
//   try {
//     return JSON.parse(atob(token.split('.')[1]));
//   } catch {
//     return null;
//   }
// };

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
//   const [adminInfo, setAdminInfo] = useState(() => (token ? parseJwt(token) : null));

//   // Save token and admin info on login
//   const login = (jwtToken) => {
//     localStorage.setItem('adminToken', jwtToken);
//     setToken(jwtToken);
//     setAdminInfo(parseJwt(jwtToken));
//   };

//   // Remove token on logout
//   const logout = () => {
//     localStorage.removeItem('adminToken');
//     setToken(null);
//     setAdminInfo(null);
//   };

//   // Check if token is valid / exists
//   const isAuthenticated = Boolean(token);

//   // Optional: auto logout if token expired (based on exp claim)
//   useEffect(() => {
//     if (token) {
//       const { exp } = parseJwt(token) || {};
//       if (exp && Date.now() >= exp * 1000) {
//         logout();
//       }
//     }
//   }, [token]);

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         adminInfo,
//         isAuthenticated,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook for easier access
// export const useAuth = () => useContext(AuthContext);
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Helper to decode token payload
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
  const [adminInfo, setAdminInfo] = useState(() => 
    localStorage.getItem('adminToken') ? parseJwt(localStorage.getItem('adminToken')) : null
  );

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

  // Auto logout if token expired
  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.exp) {
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        
        if (currentTime >= expirationTime) {
          logout();
        } else {
          // Set timeout to logout when token expires
          const timeout = expirationTime - currentTime;
          const timer = setTimeout(logout, timeout);
          return () => clearTimeout(timer);
        }
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