import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RequireAuth = () => {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect them to the login page, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
