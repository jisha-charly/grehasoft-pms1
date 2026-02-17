import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-white">
      <div className="text-center p-5">
        <div className="mb-4">
          <i className="bi bi-search text-primary display-1"></i>
        </div>
        <h1 className="display-1 fw-bold text-dark">404</h1>
        <h3 className="fw-bold">Page Not Found</h3>
        <p className="text-muted mb-4">
          The project, lead, or resource you are looking for does not exist or has been moved.
        </p>
        <button className="btn btn-primary px-4 fw-bold" onClick={() => navigate('/')}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;