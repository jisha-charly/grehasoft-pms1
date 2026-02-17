import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crmService } from '../../../api/crm.service';
import { Client } from '../../../types/crm';
import { PATHS } from '../../../routes/paths';

const ClientList: React.FC = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const fetchClients = async () => {
    try {
      const res = await crmService.getClients({
        limit: 10,
        offset: (page - 1) * 10,
      });

      setClients(res.data.results);
      setTotalCount(res.data.count);
    } catch (err) {
      console.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page]);

  return (
    <div className="container-fluid">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h4 className="fw-bold mb-0">Clients</h4>
        <span className="text-muted small">
          Total Clients: {totalCount}
        </span>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Projects</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No clients found.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr
                    key={client.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      navigate(`${PATHS.CRM.CLIENTS}/${client.id}`)
                    }
                  >
                    <td className="fw-semibold">{client.name}</td>
                    <td>{client.company_name}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>
                      <span className="badge bg-primary">
                        {client.project_count || 0}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="card-footer d-flex justify-content-between">
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>

          <button
            className="btn btn-outline-primary btn-sm"
            disabled={clients.length < 10}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientList;
