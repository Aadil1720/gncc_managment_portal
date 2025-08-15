
import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useThemeContext } from '../context/ThemeContext';

const AppBar = ({ handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: mode === 'light'
          ? 'linear-gradient(to right, #4e54c8, #6a5acd)'
          : '#1e1e2f',
        color: '#ffffff',
        boxShadow: 'none',
        height: isMobile ? 60 : 64, // Slightly taller on mobile
      }} >
      <Toolbar
       sx={{ px: 2, minHeight: isMobile ? 56 : 64 }}
       >
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1 }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1, textAlign: isMobile ? 'center' : 'left' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: isMobile ? '1rem' : '1.25rem',
              lineHeight: isMobile ? 1.3 : 1.5,
              textShadow: mode === 'light' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
              display: 'block',
              wordBreak: 'break-word',
              whiteSpace: isMobile ? 'normal' : 'nowrap',
              py: isMobile ? 0.5 : 0,
            }}
          >
            {isMobile
              ? (
                <>
                  GNCC<br />Management System
                </>
              )
              : 'GNCC Management System'}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 0.5 : 2,
            ml: isMobile ? 1 : 0,
          }}
        >
          <IconButton onClick={toggleColorMode} color="inherit" sx={{ p: isMobile ? '5px' : '8px' }}>
            {mode === 'dark' ? (
              <Brightness7Icon fontSize={isMobile ? 'small' : 'medium'} />
            ) : (
              <Brightness4Icon fontSize={isMobile ? 'small' : 'medium'} />
            )}
          </IconButton>

          <IconButton color="inherit" sx={{ p: isMobile ? '5px' : '8px' }}>
            <NotificationsIcon fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>

          <Avatar
            alt="User Avatar"
            src="/static/images/avatar/1.jpg"
            sx={{
              width: isMobile ? 28 : 40,
              height: isMobile ? 28 : 40,
            }}
          />
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;



// import React from 'react';
// import { AppBar as MuiAppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material';
// import Brightness4Icon from '@mui/icons-material/Brightness4';
// import Brightness7Icon from '@mui/icons-material/Brightness7';
// import MenuIcon from '@mui/icons-material/Menu';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { useThemeContext } from '../context/ThemeContext';

// const AppBar = ({ handleDrawerToggle }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const { mode, toggleColorMode } = useThemeContext();

//   return (
//     <MuiAppBar
//       position="fixed"
//       sx={{
//         zIndex: (theme) => theme.zIndex.drawer + 1,
//         background: mode === 'light'
//           ? 'linear-gradient(to right, #4e54c8, #6a5acd)'
//           : '#1e1e2f',
//         color: '#ffffff',
//         boxShadow: 'none',
//         height: isMobile ? 60 : 64, // Slightly taller on mobile
//       }}
//     >
//       <Toolbar sx={{ 
//         px: isMobile ? 1.5 : 2, // Adjusted padding
//         minHeight: '100% !important', // Force full height
//       }}>
//         {isMobile && (
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ 
//               mr: 1,
//               p: 1, // Larger touch target
//             }}
//           >
//             <MenuIcon fontSize={isMobile ? 'medium' : 'large'} /> 
//           </IconButton>
//         )}

//         <Box sx={{ 
//           flexGrow: 1, 
//           textAlign: isMobile ? 'center' : 'left',
//           ml: isMobile ? 0 : 1, // Better spacing
//         }}>
//           <Typography
//             variant="h6"
//             component="div"
//             sx={{
//               fontWeight: 700,
//               fontSize: isMobile ? '1.2rem' : '1.5rem', // Larger font
//               lineHeight: 1.3,
//               textShadow: mode === 'light' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
//               display: 'block',
//               wordBreak: 'break-word',
//               whiteSpace: isMobile ? 'normal' : 'nowrap',
//               py: isMobile ? 0.5 : 0, // Vertical padding
//             }}
//           >
//             {isMobile
//               ? 'GNCC Management'
//               : 'GNCC Management System'}
//           </Typography>
//         </Box>

//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: isMobile ? 0.75 : 1.75, // Larger gaps
//             ml: isMobile ? 0.5 : 0,
//           }}
//         >
//           <IconButton 
//             onClick={toggleColorMode} 
//             color="inherit" 
//             sx={{ 
//               p: 1, // Larger touch target
//               '&:hover': {
//                 backgroundColor: 'rgba(255,255,255,0.1)'
//               }
//             }}
//           >
//             {mode === 'dark' ? (
//               <Brightness7Icon fontSize={isMobile ? 'medium' : 'large'} />
//             ) : (
//               <Brightness4Icon fontSize={isMobile ? 'medium' : 'large'} />
//             )}
//           </IconButton>

//           <IconButton 
//             color="inherit" 
//             sx={{ 
//               p: 1,
//               '&:hover': {
//                 backgroundColor: 'rgba(255,255,255,0.1)'
//               }
//             }}
//           >
//             <NotificationsIcon fontSize={isMobile ? 'medium' : 'large'} />
//           </IconButton>

//           <Avatar
//             alt="User Avatar"
//             src="/static/images/avatar/1.jpg"
//             sx={{
//               width: isMobile ? 32 : 36, // Larger avatar
//               height: isMobile ? 32 : 36,
//               border: '2px solid rgba(255,255,255,0.2)',
//             }}
//           />
//         </Box>
//       </Toolbar>
//     </MuiAppBar>
//   );
// };

// export default AppBar;


