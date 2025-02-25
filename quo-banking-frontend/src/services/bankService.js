import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Obtener todas los bancos
const getBanks = async () => {
  const response = await axios.get(`${API_URL}/belvo/institutions/`);
  return response.data;
};

// Crear links de prueba
const createTestLinks = async () => {
  const response = await axios.post(`${API_URL}/belvo/create_test_links/`);
  return response.data;
};

// Obtener todas las cuentas
const getAllAccounts = async () => {
  const response = await axios.get(`${API_URL}/belvo/all_accounts/`);
  return response.data;
};

// Obtener cuentas por banco (link)
const getAccountsByBank = async (linkId) => {
  const response = await axios.get(`${API_URL}/belvo/accounts/?link_id=${linkId}`);
  return response.data;
};

// Obtener transacciones y KPI
const getTransactions = async (linkId, accountId, dateFrom, dateTo) => {
  const response = await axios.get(
    `${API_URL}/belvo/transactions/?link_id=${linkId}&account_id=${accountId}&date_from=${dateFrom}&date_to=${dateTo}`
  );
  return response.data;
};

// Obtener detalles de una transacción
const getTransactionDetails = async (transactionId) => {
  const response = await axios.get(`${API_URL}/belvo/${transactionId}/details/`);
  return response.data;
};

const bankService = {
  getBanks,
  createTestLinks,
  getAllAccounts,
  getAccountsByBank,
  getTransactions,
  getTransactionDetails,
};

export default bankService;
