import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type{ UserRole } from '../types/auth';
import { PATHS } from './paths';
import {Spinner} from '../components/common/Spinner';

interface Props {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}


const PrivateRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // 1. Show global loader while checking JWT validity
  if (loading) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // 2. Not logged in? Send to login but remember where they tried to go
  if (!isAuthenticated) {
    return <Navigate to={PATHS.AUTH.LOGIN} state={{ from: location }} replace />;
  }

  // 3. RBAC Check: Is the user's role allowed here?
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={PATHS.AUTH.UNAUTHORIZED} replace />;
  }

  // 4. Authorized: Render the protected component
  return children;
};

export default PrivateRoute;