import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center">
        <h1 className="display-4 fw-bold text-danger">403</h1>
        <h4 className="fw-bold mb-3">Access Denied</h4>
        <p className="text-muted mb-4">
          You do not have permission to access this page.
        </p>

        <button
          className="btn btn-primary"
          onClick={() => navigate(PATHS.DASHBOARD.ROOT)}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
