import React from 'react';

interface Props {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({ icon = 'bi-search', title, description, action }) => (
  <div className="text-center py-5">
    <div className="mb-3">
      <i className={`bi ${icon} text-muted opacity-25`} style={{ fontSize: '3rem' }}></i>
    </div>
    <h5 className="fw-bold">{title}</h5>
    {description && <p className="text-muted mx-auto" style={{ maxWidth: '300px' }}>{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);