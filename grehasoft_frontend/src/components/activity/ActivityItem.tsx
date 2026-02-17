import React from "react";
import { format } from "date-fns";
import { ActivityLog } from "../../types/activity";

interface Props {
  log: ActivityLog;
}

const ActivityItem: React.FC<Props> = ({ log }) => {
  return (
    <div className="list-group-item border-start border-4 border-info p-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="fw-semibold text-dark">{log.action}</div>

          <div className="small text-muted mt-1">
            By <span className="fw-medium text-primary">{log.user_full_name}</span>
            {log.project_name && (
              <>
                {" "}
                on project{" "}
                <span className="fw-medium text-dark">
                  {log.project_name}
                </span>
              </>
            )}
          </div>

          <span className="badge bg-light text-dark border mt-2">
            {log.department_name}
          </span>
        </div>

        <div className="text-end">
          <div className="small fw-semibold">
            {format(new Date(log.created_at), "HH:mm:ss")}
          </div>
          <div className="small text-muted">
            {format(new Date(log.created_at), "MMM dd, yyyy")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
