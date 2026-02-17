import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { crmService } from "../../../api/crm.service";
import { Lead, LeadFollowUp } from "../../../types/crm";
import { PATHS } from "../../../routes/paths";

const LeadDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [followUps, setFollowUps] = useState<LeadFollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      if (!id) return;

      const leadRes = await crmService.getLead(Number(id));
      const followRes = await crmService.getFollowUps(Number(id));

      setLead(leadRes.data);
      setFollowUps(followRes.data);
    } catch (error) {
      console.error("Error loading lead details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleConvert = async () => {
    if (!lead) return;

    try {
      const res = await crmService.convertLead(lead.id, 1); // Replace 1 with selected PM
      navigate(PATHS.CRM_CONVERSION_SUCCESS, {
        state: { projectId: res.data?.id },
      });
    } catch (error) {
      alert("Conversion failed");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!lead) return <div className="p-4">Lead not found</div>;

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <button
          className="btn btn-link"
          onClick={() => navigate(PATHS.CRM_LEADS)}
        >
          ← Back to Leads
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h4 className="fw-bold">{lead.name}</h4>
          <p className="text-muted mb-1">{lead.company_name}</p>
          <p className="small mb-1">
            Email: <strong>{lead.email}</strong>
          </p>
          <p className="small mb-1">
            Phone: <strong>{lead.phone}</strong>
          </p>
          <p className="small">
            Status:{" "}
            <span className="badge bg-info">{lead.status.toUpperCase()}</span>
          </p>

          {lead.status === "qualified" && (
            <button className="btn btn-success mt-3" onClick={handleConvert}>
              Convert to Project
            </button>
          )}
        </div>
      </div>

      {/* Follow-ups Section */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Follow-Ups</h5>

          {followUps.length === 0 ? (
            <p className="text-muted">No follow-ups recorded.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {followUps.map((f) => (
                <li key={f.id} className="list-group-item">
                  <div className="small text-muted">
                    {new Date(f.created_at).toLocaleString()}
                  </div>
                  <div>{f.note}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
