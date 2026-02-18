import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Spinner } from "../components/common/Spinner";


interface Props {
  children: React.ReactNode;
}

/**
 * AppLayout acts as a global entry point.
 * It ensures the Auth state is checked before rendering anything.
 */
const AppLayout: React.FC<Props> = ({ children }) => {
  const { loading } = useAuth();

  // Global Loading State (Wait for token validation on app refresh)
  if (loading) {
    return (
      <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-white">
        <Spinner size="lg" color="primary" />
        <h5 className="mt-3 fw-bold text-primary animate-pulse">Initializing Grehasoft...</h5>
      </div>
    );
  }

  return (
    <>
      {/* Global UI elements like Toasts/Modals can go here */}
      <div id="modal-root"></div>
      
      {/* Render the application (AppRoutes) */}
      {children}
    </>
  );
};

export default AppLayout;