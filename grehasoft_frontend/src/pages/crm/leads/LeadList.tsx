import React, { useState, useEffect, useCallback } from 'react';
import { crmService } from '../../../api/crm.service';
import { Lead, LeadStatus } from '../../../types/crm';
import { DataTable } from '../../../components/common/DataTable';
import { LeadStatusBadge } from '../../../components/crm/LeadStatusBadge';
import { ConvertLeadModal } from '../../../components/crm/ConvertLeadModal';
import { useDebounce } from '../../../hooks/useDebounce';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/common/Button';

const LeadList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // State for Conversion Modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await crmService.getLeads({
        search: debouncedSearch,
        status: statusFilter,
      });
      setLeads(response.data.results);
      setTotalCount(response.data.count);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const columns = [
    { 
      header: 'Company / Lead', 
      render: (lead: Lead) => (
        <div>
          <div className="fw-bold">{lead.company_name}</div>
          <small className="text-muted">{lead.name}</small>
        </div>
      ) 
    },
    { header: 'Status', render: (lead: Lead) => <LeadStatusBadge status={lead.status} /> },
    { header: 'Department', render: (lead: Lead) => <span className="text-capitalize small">{lead.department_name}</span> },
    { 
      header: 'Actions', 
      render: (lead: Lead) => (
        <div className="d-flex gap-2">
          <Link to={`/crm/leads/${lead.id}`} className="btn btn-sm btn-outline-primary">Details</Link>
          {lead.status === 'qualified' && (
            <button 
              className="btn btn-sm btn-success" 
              onClick={() => setSelectedLead(lead)}
            >
              Convert
            </button>
          )}
        </div>
      ) 
    },
  ];

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Leads Repository</h3>
        <Button variant="primary"><i className="bi bi-plus-lg me-2"></i>New Lead</Button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search company, name or email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select className="form-select" onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={leads} loading={loading} />

      {selectedLead && (
        <ConvertLeadModal 
          leadId={selectedLead.id} 
          leadName={selectedLead.company_name} 
          onClose={() => setSelectedLead(null)}
          onSuccess={() => {
            setSelectedLead(null);
            fetchLeads();
          }}
        />
      )}
    </div>
  );
};

export default LeadList;