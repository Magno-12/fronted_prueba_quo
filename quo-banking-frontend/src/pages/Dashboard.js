import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Link,
} from '@mui/material';
import bankService from '../services/bankService';
import { useSnackbar } from 'notistack';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await bankService.getAllAccounts();
        setSummary(response);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        enqueueSnackbar('Error al cargar las cuentas bancarias', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enqueueSnackbar]);

  const handleCreateTestLinks = async () => {
    try {
      setLoading(true);
      await bankService.createTestLinks();
      enqueueSnackbar('Links de prueba creados exitosamente', { variant: 'success' });
      
      // Refresh data
      const response = await bankService.getAllAccounts();
      setSummary(response);
    } catch (error) {
      console.error('Error creating test links:', error);
      enqueueSnackbar('Error al crear links de prueba', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resumen de cuentas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateTestLinks}
        >
          Crear links de prueba
        </Button>
      </Box>

      {summary && summary.total_accounts > 0 ? (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total de cuentas bancarias
              </Typography>
              <Typography variant="h3" color="primary">
                {summary.total_accounts}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Distribuidas en {summary.institutions.length} instituciones bancarias
              </Typography>
            </CardContent>
          </Card>

          <Typography variant="h5" sx={{ mb: 2 }}>
            Tus instituciones bancarias
          </Typography>
          
          <Grid container spacing={3}>
            {summary.institutions.map((institution, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {institution.institution_name}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {institution.accounts.length} cuentas
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {institution.accounts.slice(0, 3).map((account, idx) => (
                        <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                          {account.name} - {account.currency} {account.balance.current.toFixed(2)}
                        </Typography>
                      ))}
                      {institution.accounts.length > 3 && (
                        <Typography variant="body2" color="text.secondary">
                          +{institution.accounts.length - 3} más...
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={RouterLink}
                      to={`/banks/${institution.link_id}`}
                      variant="outlined"
                      size="small"
                      fullWidth
                    >
                      Ver detalles
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" align="center" sx={{ my: 2 }}>
              No tienes cuentas bancarias conectadas
            </Typography>
            <Typography variant="body2" align="center" sx={{ mb: 3 }}>
              Para comenzar, haz clic en el botón "Crear links de prueba" o 
              <Link component={RouterLink} to="/banks" sx={{ ml: 1 }}>
                conecta manualmente un banco
              </Link>
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Dashboard;
