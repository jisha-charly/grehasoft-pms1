import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { crmService } from "../../../api/crm.service";
import { Lead } from "../../../types/crm";
import { PATHS } from "../../../routes/paths";

const LeadList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      const res = await crmService.getLeads();
      setLeads(res.data.results);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getBadge = (status: string) => {
    const map: any = {
      new: "bg-info",
      contacted: "bg-primary",
      qualified: "bg-warning text-dark",
      converted: "bg-success",
      lost: "bg-danger",
    };
    return (
      <span className={`badge ${map[status] || "bg-secondary"}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mb-4">
        <h3 className="fw-bold">Leads</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigate(PATHS.CRM_LEADS)}
        >
          + Create Lead
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-uppercase">
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>Source</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{lead.company_name}</td>
                    <td>{getBadge(lead.status)}</td>
                    <td>{lead.source}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          navigate(PATHS.CRM_LEAD_DETAILS(lead.id))
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadList;
