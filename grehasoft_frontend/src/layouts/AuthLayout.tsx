import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
//import { PATHS } from '../routes/paths';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if user is already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-layout bg-light min-vh-100 d-flex flex-column">
      <div className="container my-auto py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5 col-xl-4">
            {/* Logo Section */}
            <div className="text-center mb-4">
              <h1 className="h2 fw-bold text-primary mb-1">Grehasoft</h1>
              <p className="text-muted small uppercase fw-semibold tracking-wider">
                Enterprise PMS & CRM
              </p>
            </div>
            
            {/* Page Content injected here */}
            <Outlet />

            <div className="text-center mt-4">
              <p className="small text-muted">
                &copy; {new Date().getFullYear()} Grehasoft Solutions. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;