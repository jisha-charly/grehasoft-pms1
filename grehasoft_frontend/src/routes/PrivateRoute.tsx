// src/routes/PrivateRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PATHS } from './paths';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={PATHS.AUTH.LOGIN}
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
