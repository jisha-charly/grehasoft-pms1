import React, { useEffect, useState } from "react";
import ActivityItem from "./ActivityItem";
import { ActivityLog } from "../../types/activity";
import { reportService } from "../../api/report.service";

const ActivityTimeline: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await reportService.getActivityLogs({
        limit: 20,
        offset: (page - 1) * 20,
      });

      setLogs(response.data.results || response.data);
    } catch (error) {
      console.error("Failed to load activity logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="alert alert-info text-center">
        No activity logs found.
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="list-group list-group-flush">
          {logs.map((log) => (
            <ActivityItem key={log.id} log={log} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="card-footer d-flex justify-content-between">
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <button
          className="btn btn-outline-primary btn-sm"
          disabled={logs.length < 20}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActivityTimeline;
