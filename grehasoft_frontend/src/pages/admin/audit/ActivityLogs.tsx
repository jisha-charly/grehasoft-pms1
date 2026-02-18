import React, { useState, useEffect } from 'react';
import { reportService } from '../../../api/report.service';
import type { ActivityLog } from '../../../types/activity';
import { ActivityTimeline } from '../../../components/activity/ActivityTimeline';

import { Button } from '../../../components/common/Button';

import { Spinner } from '../../../components/common/Spinner';


const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ department: '', action: '' });

  useEffect(() => {
    setLoading(true);
    reportService.getActivityLogs(filter).then(res => {
      setLogs(res.data.results);
      setLoading(false);
    });
  }, [filter]);

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h3 className="fw-bold">System Audit Trail</h3>
        <p className="text-muted small">Immutable record of all enterprise activity.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '80px' }}>
            <div className="card-body">
              <h6 className="fw-bold mb-3 border-bottom pb-2 text-uppercase xsmall">Filter Logs</h6>
              <div className="mb-3">
                <label className="form-label xsmall fw-bold text-muted">Department</label>
                <select 
                  className="form-select form-select-sm"
                  onChange={(e) => setFilter({...filter, department: e.target.value})}
                >
                  <option value="">Global View</option>
                  <option value="software">Software</option>
                  <option value="digital_marketing">Marketing</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label xsmall fw-bold text-muted">Action Type</label>
                <select 
                  className="form-select form-select-sm"
                  onChange={(e) => setFilter({...filter, action: e.target.value})}
                >
                  <option value="">All Actions</option>
                  <option value="create">Creations</option>
                  <option value="update">Updates</option>
                  <option value="convert">CRM Conversions</option>
                </select>
              </div>
              <hr />
              <Button variant="outline-primary" className="w-100 btn-sm">Export to CSV</Button>
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="card border-0 shadow-sm p-4">
            {loading ? <Spinner center /> : <ActivityTimeline logs={logs} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;