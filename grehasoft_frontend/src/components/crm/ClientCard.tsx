import React from 'react';
import { Link } from 'react-router-dom';
import { Client } from '../../types/crm';
import { PATHS } from '../../routes/paths';

interface Props {
  client: Client;
}

export const ClientCard: React.FC<Props> = ({ client }) => {
  return (
    <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <div 
            className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center me-3"
            style={{ width: '48px', height: '48px' }}
          >
            <i className="bi bi-building fs-4"></i>
          </div>
          <div className="min-w-0">
            <h6 className="fw-bold mb-0 text-truncate">{client.company_name}</h6>
            <small className="text-muted text-capitalize">{client.department_name}</small>
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex align-items-center mb-1">
            <i className="bi bi-person xsmall text-muted me-2"></i>
            <span className="small fw-medium">{client.name}</span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <i className="bi bi-envelope xsmall text-muted me-2"></i>
            <span className="small text-truncate text-primary">{client.email}</span>
          </div>
          {client.phone && (
            <div className="d-flex align-items-center">
              <i className="bi bi-telephone xsmall text-muted me-2"></i>
              <span className="small">{client.phone}</span>
            </div>
          )}
        </div>

        <hr className="opacity-10" />

        <div className="d-flex justify-content-between align-items-center mt-3">
          <Link 
            to={PATHS.CRM.CLIENT_DETAILS(client.id)} 
            className="btn btn-sm btn-outline-primary fw-bold"
          >
            View Portfolio
          </Link>
          <span className="xsmall text-muted">
            Added: {new Date(client.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};