import React from 'react';

const ServerError: React.FC = () => {
  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center p-5 card border-0 shadow-lg" style={{ maxWidth: '500px' }}>
        <div className="mb-4 text-danger">
          <i className="bi bi-cloud-slash display-1"></i>
        </div>
        <h2 className="fw-bold">Connection Issue</h2>
        <p className="text-muted mb-4">
          We are having trouble communicating with the Grehasoft servers. 
          This could be due to a brief maintenance period or a local network issue.
        </p>
        <div className="d-grid gap-2">
          <button className="btn btn-primary fw-bold" onClick={() => window.location.reload()}>
            Retry Connection
          </button>
          <p className="xsmall text-muted mt-3">
            If this persists, please contact the IT support desk.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;