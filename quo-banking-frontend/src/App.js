import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import theme from './styles/theme';
import './styles/global.css';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BanksList from './pages/BanksList';
import BankDetails from './pages/BankDetails';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';

// Auth Protection
import RequireAuth from './components/auth/RequireAuth';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
          
          {/* Protected routes */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<MainLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="banks" element={<BanksList />} />
              <Route path="banks/:bankId" element={<BankDetails />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
