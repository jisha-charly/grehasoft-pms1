import React from 'react';
import { Link } from 'react-router-dom';
import { Lead } from '../../types/crm';
import { LeadStatusBadge } from './LeadStatusBadge';
import { Spinner } from '../common/Spinner';
import { PATHS } from '../../routes/paths';
import { usePermissions } from '../../hooks/usePermissions';

interface Props {
  leads: Lead[];
  loading: boolean;
  onConvert: (lead: Lead) => void;
  onDelete: (id: number) => void;
}

export const LeadTable: React.FC<Props> = ({ leads, loading, onConvert, onDelete }) => {
  const { canConvertLeads, isAdmin } = usePermissions();

  if (loading) return <Spinner center />;

  return (
    <div className="table-responsive bg-white rounded shadow-sm">
      <table className="table table-hover align-middle mb-0 table-dense">
        <thead className="bg-light">
          <tr>
            <th className="px-4 py-3">Lead Information</th>
            <th className="py-3">Status</th>
            <th className="py-3">Department</th>
            <th className="py-3">Source</th>
            <th className="py-3">Created</th>
            <th className="py-3 text-end px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-4 py-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded-circle p-2 me-3 d-none d-lg-block">
                      <i className="bi bi-person-fill text-secondary"></i>
                    </div>
                    <div>
                      <Link 
                        to={PATHS.CRM.LEAD_DETAILS(lead.id)} 
                        className="fw-bold text-dark text-decoration-none d-block mb-0"
                      >
                        {lead.company_name || lead.name}
                      </Link>
                      <small className="text-muted">{lead.email}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <LeadStatusBadge status={lead.status} />
                </td>
                <td>
                  <span className="badge bg-light text-dark border text-capitalize fw-normal">
                    {lead.department_name}
                  </span>
                </td>
                <td>
                  <span className="small text-muted">{lead.source}</span>
                </td>
                <td>
                  <span className="small">{new Date(lead.created_at).toLocaleDateString()}</span>
                </td>
                <td className="text-end px-4">
                  <div className="btn-group shadow-sm">
                    <Link 
                      to={PATHS.CRM.LEAD_DETAILS(lead.id)} 
                      className="btn btn-sm btn-white border"
                      title="View Details"
                    >
                      <i className="bi bi-eye"></i>
                    </Link>
                    
                    {lead.status === 'qualified' && canConvertLeads && (
                      <button 
                        className="btn btn-sm btn-success border"
                        onClick={() => onConvert(lead)}
                        title="Convert to Project"
                      >
                        <i className="bi bi-arrow-repeat"></i>
                      </button>
                    )}

                    {isAdmin && (
                      <button 
                        className="btn btn-sm btn-outline-danger border"
                        onClick={() => onDelete(lead.id)}
                        title="Delete Lead"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-5">
                <i className="bi bi-inbox text-muted display-6 mb-3 d-block opacity-25"></i>
                <p className="text-muted">No leads found matching your criteria.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};