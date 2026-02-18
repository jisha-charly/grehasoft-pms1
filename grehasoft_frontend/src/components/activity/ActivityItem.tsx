import React from 'react';
import type { ActivityLog } from '../../types/activity';
import { dateHelper } from '../../utils/dateHelper';

export const ActivityItem: React.FC<{ log: ActivityLog }> = ({ log }) => (
  <div className="position-relative mb-4">
    <div className="position-absolute bg-primary rounded-circle" 
      style={{ width: '12px', height: '12px', left: '-22px', top: '4px', border: '2px solid white' }}></div>
    <div className="d-flex justify-content-between align-items-start">
      <div>
        <div className="fw-bold small">{log.action}</div>
        <div className="xsmall text-muted">
          {log.user_full_name} • <span className="text-uppercase">{log.department_name}</span>
        </div>
      </div>
      <div className="text-end xsmall text-muted">
        {dateHelper.formatRelative(log.created_at)}
      </div>
    </div>
  </div>
);