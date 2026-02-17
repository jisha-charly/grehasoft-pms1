import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-white">
      <div className="text-center p-5">
        <div className="mb-4">
          <i className="bi bi-shield-lock text-danger" style={{ fontSize: '5rem' }}></i>
        </div>
        <h1 className="fw-bold display-4">403</h1>
        <h3 className="fw-bold text-dark">Access Denied</h3>
        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>
          You do not have the required permissions to view this resource. 
          This action has been logged for security purposes.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <button 
            className="btn btn-primary px-4 fw-bold shadow-sm" 
            onClick={() => navigate('/')}
          >
            Return to Dashboard
          </button>
          <button 
            className="btn btn-outline-secondary px-4 fw-bold" 
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;