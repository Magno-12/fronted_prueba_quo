import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import { ArrowBack, ArrowUpward, ArrowDownward, Info as InfoIcon } from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import bankService from '../services/bankService';
import { useSnackbar } from 'notistack';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const BankDetails = () => {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [kpi, setKpi] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchAccountsData = async () => {
      try {
        const response = await bankService.getAccountsByBank(bankId);
        setAccounts(response.results || []);
        
        if (response.results && response.results.length > 0) {
          setSelectedAccount(response.results[0]);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        enqueueSnackbar('Error al cargar las cuentas', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchAccountsData();
  }, [bankId, enqueueSnackbar]);

  useEffect(() => {
    const fetchTransactionsData = async () => {
      if (!selectedAccount) return;
      
      try {
        setLoading(true);
        
        // Fechas para el rango de transacciones (últimos 3 meses)
        const today = new Date();
        const dateTo = today.toISOString().split('T')[0];
        const dateFrom = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];
        
        const response = await bankService.getTransactions(
          bankId,
          selectedAccount.id,
          dateFrom,
          dateTo
        );
        
        setTransactions(response.transactions || []);
        setKpi(response.kpi);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        enqueueSnackbar('Error al cargar las transacciones', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (selectedAccount) {
      fetchTransactionsData();
    }
  }, [selectedAccount, bankId, enqueueSnackbar]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  const pieChartData = {
    labels: ['Ingresos', 'Gastos'],
    datasets: [
      {
        data: kpi ? [kpi.income, kpi.expenses] : [0, 0],
        backgroundColor: ['#4caf50', '#f44336'],
        borderColor: ['#388e3c', '#d32f2f'],
        borderWidth: 1,
      },
    ],
  };

  // Agrupar transacciones por categoría para el gráfico de barras
  const categoryExpenses = transactions
    .filter(t => t.type === 'OUTFLOW')
    .reduce((acc, t) => {
      const category = t.category || 'Otros';
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {});

  const barChartData = {
    labels: Object.keys(categoryExpenses),
    datasets: [
      {
        label: 'Gastos por categoría',
        data: Object.values(categoryExpenses),
        backgroundColor: 'rgba(63, 81, 181, 0.6)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gastos por categoría',
      },
    },
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading && !selectedAccount) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1">
          Detalles de la cuenta
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Listado de cuentas */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mis cuentas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {accounts.map((account) => (
                <Box
                  key={account.id}
                  onClick={() => handleAccountSelect(account)}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 2,
                    cursor: 'pointer',
                    bgcolor: selectedAccount?.id === account.id ? 'primary.light' : 'background.paper',
                    '&:hover': {
                      bgcolor: selectedAccount?.id === account.id ? 'primary.light' : 'action.hover',
                    },
                  }}
                >
                  <Typography variant="subtitle1">
                    {account.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {account.category} • {account.type || 'Cuenta'}
                  </Typography>
                  <Typography variant="h6" color={selectedAccount?.id === account.id ? 'white' : 'primary'}>
                    {formatCurrency(account.balance.current, account.currency)}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Detalles de la cuenta seleccionada */}
        <Grid item xs={12} md={8}>
          {selectedAccount ? (
            <>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h5">
                        {selectedAccount.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        {selectedAccount.category} • {selectedAccount.institution.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
                      <Typography variant="h4" color="primary">
                        {formatCurrency(selectedAccount.balance.current, selectedAccount.currency)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Disponible: {formatCurrency(selectedAccount.balance.available, selectedAccount.currency)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              {/* KPI de Balance */}
              {kpi && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Balance (Ingresos - Gastos)
                    </Typography>
                    <Typography variant="h4" color={kpi.balance >= 0 ? 'primary.main' : 'error.main'}>
                      {formatCurrency(kpi.balance, selectedAccount.currency)}
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ArrowUpward sx={{ color: 'success.main', mr: 1 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Ingresos
                            </Typography>
                            <Typography variant="h6" color="success.main">
                              {formatCurrency(kpi.income, selectedAccount.currency)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ArrowDownward sx={{ color: 'error.main', mr: 1 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Gastos
                            </Typography>
                            <Typography variant="h6" color="error.main">
                              {formatCurrency(kpi.expenses, selectedAccount.currency)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 3, height: 200 }}>
                      <Pie data={pieChartData} />
                    </Box>
                  </CardContent>
                </Card>
              )}
              
              {/* Tabs de análisis */}
              <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs 
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                  >
                    <Tab label="Transacciones" />
                    <Tab label="Análisis de gastos" />
                  </Tabs>
                </Box>
                
                <CardContent>
                  {/* Transacciones */}
                  {selectedTab === 0 && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Movimientos recientes
                      </Typography>
                      
                      {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                          <CircularProgress />
                        </Box>
                      ) : transactions.length > 0 ? (
                        <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                          <Table stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Categoría</TableCell>
                                <TableCell align="right">Monto</TableCell>
                                <TableCell align="center">Tipo</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                  <TableCell>
                                    {formatDate(transaction.transacted_at)}
                                  </TableCell>
                                  <TableCell>{transaction.description}</TableCell>
                                  <TableCell>{transaction.category}</TableCell>
                                  <TableCell align="right">
                                    <Typography
                                      color={transaction.type === 'INFLOW' ? 'success.main' : 'error.main'}
                                      fontWeight="medium"
                                    >
                                      {transaction.type === 'INFLOW' ? '+' : '-'} 
                                      {formatCurrency(transaction.amount, selectedAccount.currency)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Chip
                                      size="small"
                                      label={transaction.type === 'INFLOW' ? 'Ingreso' : 'Gasto'}
                                      color={transaction.type === 'INFLOW' ? 'success' : 'error'}
                                      sx={{ borderRadius: 1 }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <IconButton size="small">
                                      <InfoIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                          <Typography variant="body1">
                            No hay transacciones disponibles para esta cuenta
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                  
                  {/* Análisis de gastos */}
                  {selectedTab === 1 && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Gastos por categoría
                      </Typography>
                      
                      {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                          <CircularProgress />
                        </Box>
                      ) : Object.keys(categoryExpenses).length > 0 ? (
                        <Box sx={{ height: 400 }}>
                          <Bar options={barChartOptions} data={barChartData} />
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                          <Typography variant="body1">
                            No hay datos suficientes para generar el análisis
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h6">
                    Selecciona una cuenta para ver sus detalles
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BankDetails;
