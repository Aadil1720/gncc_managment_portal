// src/pages/NotFound.js
import React from 'react';
import { Box, Typography, Button, Container, useTheme, useMediaQuery } from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          p: 3
        }}
      >
        <Typography
          variant={isMobile ? 'h3' : 'h1'}
          component="h1"
          color="primary"
          fontWeight="bold"
          gutterBottom
        >
          404
        </Typography>
        
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          component="h2"
          gutterBottom
          sx={{ mb: 2 }}
        >
          Page Not Found
        </Typography>
        
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ mb: 4, maxWidth: '500px' }}
        >
          The page you are looking for doesn't exist or has been moved. 
          Please check the URL or navigate back to the homepage.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ px: 4, py: 1.5 }}
          >
            Go to Homepage
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ px: 4, py: 1.5 }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;