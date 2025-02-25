import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Container, Box, Paper, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Container maxWidth="xs" sx={{ py: 8, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 4,
          width: '100%',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Quo Digital Banking
        </Typography>
        <Box sx={{ width: '100%', mt: 1 }}>
          <Outlet />
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthLayout;
