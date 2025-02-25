import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Página no encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/"
          size="large"
          sx={{ mt: 2 }}
        >
          Volver al inicio
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
