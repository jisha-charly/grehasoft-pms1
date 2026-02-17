import React from 'react';
import { TaskPriority as PriorityType } from '../../../types/pms';

export const TaskPriority: React.FC<{ priority: PriorityType }> = ({ priority }) => {
  const config: Record<PriorityType, { color: string; icon: string }> = {
    critical: { color: 'danger', icon: 'bi-exclamation-octagon' },
    high: { color: 'warning text-dark', icon: 'bi-arrow-up-circle' },
    medium: { color: 'info text-dark', icon: 'bi-circle' },
    low: { color: 'secondary', icon: 'bi-arrow-down-circle' },
  };

  const { color, icon } = config[priority];

  return (
    <span className={`badge bg-${color} d-inline-flex align-items-center gap-1 xsmall fw-bold text-uppercase`}>
      <i className={`bi ${icon}`}></i>
      {priority}
    </span>
  );
};