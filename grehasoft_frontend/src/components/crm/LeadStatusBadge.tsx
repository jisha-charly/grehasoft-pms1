import React from "react";
import { LeadStatus } from "../../types/crm";

interface Props {
  status: LeadStatus;
}

const statusMap: Record<LeadStatus, string> = {
  new: "secondary",
  contacted: "info",
  qualified: "warning",
  converted: "success",
  lost: "danger",
};

const LeadStatusBadge: React.FC<Props> = ({ status }) => {
  return (
    <span className={`badge bg-${statusMap[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default LeadStatusBadge;
