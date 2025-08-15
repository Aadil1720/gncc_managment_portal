import React, { createContext, useMemo, useState, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();
export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  // ✅ define theme using useMemo INSIDE component, now with correct access to mode
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        ...(mode === 'light'
          ? {
              primary: { main: '#4e54c8' },
              secondary: { main: '#b36fcd' },
              background: { default: '#f8f9fa', paper: '#ffffff' },
              text: { primary: '#2d3748', secondary: '#4a5568' },
            }
          : {
              primary: { main: '#8f94fb' },
              secondary: { main: '#d8b4fe' },
              background: { default: '#121212', paper: '#1e1e2f' },
              text: { primary: '#e2e8f0', secondary: '#a0aec0' },
            }),
      },
      components: {
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e2f',
              color: mode === 'light' ? '#2d3748' : '#e2e8f0',
            },
          },
        },
        MuiListItemText: {
          styleOverrides: {
            primary: {
              color: mode === 'light' ? '#2d3748' : '#e2e8f0',
              fontWeight: 500,
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              background: mode === 'light' ? '#4e54c8' : '#1e1e2f',
              color: mode === 'light' ? '#ffffff' : '#e2e8f0',
              '& .MuiTypography-h6': {
                fontWeight: 700,
                letterSpacing: '0.5px',
              },
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
