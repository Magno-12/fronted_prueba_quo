import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import bankService from '../services/bankService';
import { useSnackbar } from 'notistack';

const BanksList = () => {
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState([]);
  const [accounts, setAccounts] = useState({ total_accounts: 0, institutions: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch institutions and accounts in parallel
        const [institutionsResponse, accountsResponse] = await Promise.all([
          bankService.getBanks(),
          bankService.getAllAccounts()
        ]);

        setInstitutions(institutionsResponse.results || []);
        setAccounts(accountsResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        enqueueSnackbar('Error al cargar los datos bancarios', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enqueueSnackbar]);

  const filteredInstitutions = institutions.filter(
    (institution) =>
      institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConnectedAccounts = (institutionName) => {
    const connected = accounts.institutions.find(
      (inst) => inst.institution_name === institutionName
    );
    return connected ? connected.accounts.length : 0;
  };

  const getInstitutionLink = (institutionName) => {
    const connected = accounts.institutions.find(
      (inst) => inst.institution_name === institutionName
    );
    return connected ? connected.link_id : null;
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
      <Typography variant="h4" component="h1" gutterBottom>
        Bancos disponibles
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        placeholder="Buscar banco..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          sx: { borderRadius: 3 }
        }}
      />

      <Grid container spacing={3}>
        {filteredInstitutions.map((institution) => {
          const connectedAccounts = getConnectedAccounts(institution.name);
          const linkId = getInstitutionLink(institution.name);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={institution.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: 80,
                    mb: 2
                  }}>
                    {institution.logo ? (
                      <img
                        src={institution.logo}
                        alt={institution.display_name}
                        style={{ maxHeight: '60px', maxWidth: '100%' }}
                      />
                    ) : (
                      <Typography variant="h6" align="center">
                        {institution.display_name}
                      </Typography>
                    )}
                  </Box>
                  
                  <Typography gutterBottom variant="h6" component="h2">
                    {institution.display_name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tipo: {institution.type}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    País: {institution.country_codes.join(', ')}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {connectedAccounts > 0 ? (
                    <Typography variant="body1" color="primary">
                      {connectedAccounts} cuentas conectadas
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No tienes cuentas conectadas
                    </Typography>
                  )}
                </CardContent>
                
                <CardActions>
                  {connectedAccounts > 0 ? (
                    <Button
                      component={RouterLink}
                      to={`/banks/${linkId}`}
                      variant="contained"
                      fullWidth
                    >
                      Ver cuentas
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      fullWidth
                      disabled
                    >
                      Conectar banco
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredInstitutions.length === 0 && (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6">
            No se encontraron bancos con ese nombre
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BanksList;
