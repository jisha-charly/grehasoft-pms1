import React, { useEffect, useState } from 'react';
import { reportService } from '../../api/report.service';
import type { DashboardStats } from '../../api/report.service';
import { TaskDistributionChart } from '../../components/dashboard/chart/TaskDistributionChart';

import { KpiCard } from '../../components/dashboard/KpiCard';
//import { LeadStatusChart } from '../../components/dashboard/chart/LeadStatusChart';
//import { ProjectTrendChart } from '../../components/dashboard/chart/ProjectTrendChart';
import {Spinner} from '../../components/common/Spinner';

const SoftwareDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getDashboardStats('software').then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) return <Spinner center />;

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold text-primary">Software Development Hub</h2>
        <p className="text-muted">Engineering metrics and project health.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <KpiCard title="Current Sprints" value={stats.kpis.active_projects} icon="bi-cpu" color="primary" />
        </div>
        <div className="col-md-4">
          <KpiCard title="Tasks Blocked" value={stats.charts.tasks['blocked'] || 0} icon="bi-exclamation-octagon" color="danger" />
        </div>
        <div className="col-md-4">
          <KpiCard title="Task Backlog" value={stats.kpis.pending_tasks} icon="bi-stack" color="secondary" />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm p-4">
            <h6 className="fw-bold mb-4">Sprint Task Distribution</h6>
            <div style={{ height: '300px' }}>
              <TaskDistributionChart data={stats.charts.tasks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftwareDashboard;