import React from "react";
import { LeadFollowUp } from "../../types/crm";
import { formatDate } from "../../utils/dateHelper";

interface Props {
  followUps: LeadFollowUp[];
}

const LeadFollowUpList: React.FC<Props> = ({ followUps }) => {
  if (!followUps.length)
    return <div className="text-muted small">No follow-ups yet.</div>;

  return (
    <div className="list-group">
      {followUps.map((item) => (
        <div key={item.id} className="list-group-item">
          <div className="fw-bold small">{item.note}</div>
          <div className="text-muted small">
            {formatDate(item.created_at)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadFollowUpList;
