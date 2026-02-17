import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { crmService } from '../../../api/crm.service';
import { Lead, LeadFollowUp } from '../../../types/crm';
import { ActivityTimeline } from '../../../components/activity/ActivityTimeline';
import Spinner from '../../../components/common/Spinner';

const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [followups, setFollowups] = useState<LeadFollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [leadRes, followRes] = await Promise.all([
          crmService.getLead(Number(id)),
          crmService.getFollowUps(Number(id))
        ]);
        setLead(leadRes.data);
        setFollowups(followRes.data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading || !lead) return <Spinner center />;

  return (
    <div className="container-fluid">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '80px' }}>
            <div className="card-body">
              <h5 className="fw-bold mb-3">{lead.company_name}</h5>
              <div className="mb-3">
                <label className="xsmall text-muted text-uppercase fw-bold">Primary Contact</label>
                <div>{lead.name}</div>
              </div>
              <div className="mb-3">
                <label className="xsmall text-muted text-uppercase fw-bold">Contact Info</label>
                <div className="small text-primary">{lead.email}</div>
                <div className="small">{lead.phone}</div>
              </div>
              <hr />
              <button className="btn btn-outline-primary w-100 mb-2">Edit Details</button>
              <button className="btn btn-primary w-100">Log Call</button>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card border-0 shadow-sm p-4">
            <h6 className="fw-bold mb-4">Engagement Timeline</h6>
            {followups.length > 0 ? (
              // Map followups to ActivityLog type format for reusability
              <ActivityTimeline logs={followups.map(f => ({
                id: f.id,
                action: f.notes,
                created_at: f.created_at,
                user_full_name: f.created_by_name,
                department_name: lead.department_name
              })) as any} />
            ) : (
              <p className="text-muted text-center py-5 small">No interactions logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;