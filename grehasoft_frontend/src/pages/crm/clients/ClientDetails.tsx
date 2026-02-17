import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { crmService } from '../../../api/crm.service';
import { Client } from '../../../types/crm';

const ClientDetails: React.FC = () => {
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClient = async () => {
    if (!id) return;

    try {
      const res = await crmService.getClient(Number(id));
      setClient(res.data);
    } catch (err) {
      console.error('Failed to fetch client');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  if (loading) {
    return <div className="p-4">Loading client details...</div>;
  }

  if (!client) {
    return <div className="p-4">Client not found.</div>;
  }

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h4 className="fw-bold">{client.name}</h4>
        <p className="text-muted small">{client.company_name}</p>
      </div>

      <div className="row g-4">
        {/* Client Info */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Contact Information</h6>
              <p><strong>Email:</strong> {client.email}</p>
              <p><strong>Phone:</strong> {client.phone}</p>
              <p><strong>Department:</strong> {client.department_name}</p>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Associated Projects</h6>

              {client.projects?.length === 0 ? (
                <p className="text-muted">No projects yet.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {client.projects?.map((project: any) => (
                    <li key={project.id} className="list-group-item">
                      <div className="fw-semibold">{project.name}</div>
                      <div className="small text-muted">
                        Status: {project.status}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
