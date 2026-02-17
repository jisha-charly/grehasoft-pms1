import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const ConversionSuccess: React.FC = () => {
  const location = useLocation();
  const project = location.state?.project;

  if (!project) return <Navigate to="/crm/leads" />;

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center bg-white p-5 rounded shadow-lg border-0" style={{ maxWidth: '500px' }}>
        <div className="mb-4">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
        </div>
        <h2 className="fw-bold mb-3">Conversion Successful!</h2>
        <p className="text-muted mb-4">
          The lead for <strong>{project.client_name}</strong> has been converted. 
          A new project workspace has been initialized in the <strong>{project.department_name}</strong> department.
        </p>
        <div className="d-grid gap-2">
          <Link to={`/pms/projects/${project.id}/kanban`} className="btn btn-success fw-bold py-2">
            Go to Project Kanban Board
          </Link>
          <Link to="/crm/leads" className="btn btn-link text-decoration-none">
            Return to Leads
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConversionSuccess;