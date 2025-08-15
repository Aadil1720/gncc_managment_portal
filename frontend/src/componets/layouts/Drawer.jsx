import React from 'react';
import {
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Toolbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  MoneyOff as MoneyOffIcon,
  AttachMoney as AttachMoneyIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;


const Drawer = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const { mode } = useThemeContext();
  const { logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Students', icon: <PeopleIcon />, path: '/students' },
    { text: 'Fees', icon: <PaymentIcon />, path: '/fees' },
    { text: 'Expenditures', icon: <MoneyOffIcon />, path: '/expenditures' },
    { text: 'Match Incomes', icon: <AttachMoneyIcon />, path: '/match-incomes' },
  ];

  return (
    <MuiDrawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: isMobile ? 180 : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isMobile ? 180 : drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => {
          const selected = location.pathname === item.path;
          return (
            <ListItem
              key={item.text}
              disablePadding
              sx={{
                borderRadius: '8px',
                margin: '4px 8px',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(58, 71, 213, 0.2)',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: '#3A47D5',
                  },
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'rgba(58, 71, 213, 0.3)',
                },
                '&:hover': {
                  backgroundColor: 'rgba(58, 71, 213, 0.1)',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: '#3A47D5',
                  },
                },
                transition: 'background-color 0.2s ease, color 0.2s ease',
              }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                selected={selected}
                onClick={isMobile ? handleDrawerToggle : undefined}
                sx={{ px: isMobile ? 1 : 2 }}
              >
                <ListItemIcon sx={{ minWidth: isMobile ? 30 : 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    whiteSpace: 'nowrap',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
         {/* Logout item */}
        <ListItem
          button
          onClick={logout}
          sx={{
            borderRadius: '8px',
            margin: '4px 8px',
            '&:hover': {
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: 'red',
              },
            },
            cursor: 'pointer',
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: 'red' }} />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: 'red' }} />
        </ListItem>
      </List>
    </MuiDrawer>
  );
};

export default Drawer;
