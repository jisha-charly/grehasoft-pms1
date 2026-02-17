import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { crmService } from '../../../api/crm.service';
import { pmsService } from '../../../api/pms.service';
import { Client } from '../../../types/crm';
import { Project } from '../../../types/pms';
import { dateHelper } from '../../../utils/dateHelper';
import Spinner from '../../../components/common/Spinner';
import { DataTable } from '../../../components/common/DataTable';
import { ProjectProgress } from '../../../components/pms/project/ProjectProgress';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [clientRes, projectsRes] = await Promise.all([
          crmService.getClient(Number(id)),
          pmsService.getProjects({ client: id }) // Filtered by client ID on backend
        ]);
        setClient(clientRes.data);
        setProjects(projectsRes.data.results);
      } catch (err) {
        console.error("Error fetching client details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  if (loading) return <Spinner center size="lg" />;
  if (!client) return (
    <div className="text-center py-5">
      <h4>Client not found</h4>
      <button className="btn btn-primary mt-3" onClick={() => navigate('/crm/clients')}>Back to List</button>
    </div>
  );

  const projectColumns = [
    { 
      header: 'Project Name', 
      render: (p: Project) => (
        <Link to={`/pms/projects/${p.id}/kanban`} className="fw-bold text-decoration-none">
          {p.name}
        </Link>
      ) 
    },
    { 
      header: 'Department', 
      render: (p: Project) => (
        <span className="badge bg-light text-dark border text-capitalize">{p.department_name}</span>
      ) 
    },
    { 
      header: 'Progress', 
      render: (p: Project) => <ProjectProgress percentage={p.progress_percentage} /> 
    },
    { 
      header: 'Status', 
      render: (p: Project) => (
        <span className={`text-capitalize small fw-bold ${p.status === 'completed' ? 'text-success' : 'text-primary'}`}>
          {p.status.replace('_', ' ')}
        </span>
      ) 
    },
    { 
      header: 'Start Date', 
      render: (p: Project) => dateHelper.formatDisplay(p.start_date) 
    }
  ];

  return (
    <div className="container-fluid animate-fade-in">
      {/* Breadcrumbs & Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/crm/clients">Clients</Link></li>
            <li className="breadcrumb-item active">{client.company_name}</li>
          </ol>
        </nav>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm">
            <i className="bi bi-pencil me-2"></i>Edit Profile
          </button>
          <Link to={`/pms/projects/new?client=${client.id}`} className="btn btn-primary btn-sm">
            <i className="bi bi-plus-lg me-2"></i>New Project
          </Link>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Client Enterprise Profile */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary-subtle text-primary rounded-circle p-3 me-3">
                  <i className="bi bi-building fs-3"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0">{client.company_name}</h4>
                  <p className="text-muted small mb-0">Client ID: #{client.id}</p>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="xsmall text-muted text-uppercase fw-bold mb-3 border-bottom pb-2">Primary Contact</h6>
                <div className="fw-bold">{client.name}</div>
                <div className="small text-primary"><i className="bi bi-envelope me-2"></i>{client.email}</div>
                <div className="small"><i className="bi bi-telephone me-2"></i>{client.phone || 'No phone provided'}</div>
              </div>

              <div className="mb-4">
                <h6 className="xsmall text-muted text-uppercase fw-bold mb-3 border-bottom pb-2">Tax & Billing</h6>
                <div className="small mb-1">
                   <span className="text-muted">GST/Tax ID:</span> {client.tax_id || 'N/A'}
                </div>
                <div className="small">
                   <span className="text-muted">Address:</span><br />
                   {client.address || 'No address on file'}
                </div>
              </div>

              <div className="mb-0">
                <h6 className="xsmall text-muted text-uppercase fw-bold mb-3 border-bottom pb-2">System Metadata</h6>
                <div className="small text-muted">
                  Added on {dateHelper.formatDisplay(client.created_at)}
                </div>
                <div className="small text-muted">
                  Department: <span className="text-capitalize">{client.department_name}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats Widget */}
          <div className="card border-0 shadow-sm bg-dark text-white">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Portfolio Summary</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Projects</span>
                <span className="fw-bold">{projects.length}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Active</span>
                <span className="fw-bold text-info">{projects.filter(p => p.status === 'in_progress').length}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Completed</span>
                <span className="fw-bold text-success">{projects.filter(p => p.status === 'completed').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Associated Projects */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="fw-bold mb-0">Linked Projects</h5>
            </div>
            <div className="card-body p-0">
              <DataTable 
                columns={projectColumns} 
                data={projects} 
                loading={false} 
              />
              {projects.length === 0 && !loading && (
                <div className="text-center py-5">
                  <i className="bi bi-folder2-open display-4 text-muted"></i>
                  <p className="mt-3 text-muted">No projects found for this client.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;