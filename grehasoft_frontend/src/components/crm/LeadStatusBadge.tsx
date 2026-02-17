import React from 'react';
import { LeadStatus } from '../../types/crm';

export const LeadStatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const config: Record<LeadStatus, { color: string; label: string }> = {
    new: { color: 'info', label: 'New' },
    contacted: { color: 'primary', label: 'Contacted' },
    qualified: { color: 'warning text-dark', label: 'Qualified' },
    converted: { color: 'success', label: 'Converted' },
    lost: { color: 'secondary', label: 'Lost' },
  };

  return (
    <span className={`badge bg-${config[status].color} text-uppercase xsmall fw-bold`}>
      {config[status].label}
    </span>
  );
};