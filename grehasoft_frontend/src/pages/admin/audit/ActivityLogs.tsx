import { useEffect, useState } from 'react';
import { reportService } from '../../../api/report.service';
import type { ActivityLog } from '../../../types/activity';



const ActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    reportService.getActivityLogs()
      .then((res) => setLogs(res.data.results || res.data));
  }, []);

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Activity Logs</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          <ul className="list-group">
            {logs.map((log) => (
              <li key={log.id} className="list-group-item">
                <strong>{log.user_full_name}</strong> - {log.action}
                <div className="text-muted small">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
