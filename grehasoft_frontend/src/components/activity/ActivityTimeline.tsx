import React from 'react';
import type { ActivityLog } from '../../types/activity';
import { ActivityItem } from './ActivityItem';

export const ActivityTimeline: React.FC<{ logs: ActivityLog[] }> = ({ logs }) => {
  return (
    <div className="activity-timeline-container ps-3 border-start">
      {logs.length > 0 ? (
        logs.map((log) => (
          <ActivityItem key={log.id} log={log} />
        ))
      ) : (
        <div className="text-muted small italic py-4">No recent activity found.</div>
      )}
    </div>
  );
};