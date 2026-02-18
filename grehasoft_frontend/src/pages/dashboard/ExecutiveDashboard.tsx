import React, { useEffect, useState } from 'react';
import { reportService } from '../../api/report.service';
import type { DashboardStats } from '../../api/report.service';

import { KpiCard } from '../../components/dashboard/KpiCard';
import { LeadStatusChart } from '../../components/dashboard/chart/LeadStatusChart';
import { ProjectTrendChart } from '../../components/dashboard/chart/ProjectTrendChart';
import {Spinner} from '../../components/common/Spinner';

const ExecutiveDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const response = await reportService.getDashboardStats();
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch executive stats");
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalStats();
  }, []);

  if (loading || !stats) return <Spinner size="lg" center />;

  return (
    <div className="container-fluid animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold">Executive Overview</h2>
        <p className="text-muted">Consolidated business intelligence across all departments.</p>
      </div>

      {/* KPI Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <KpiCard title="Total Leads" value={stats.kpis.total_leads} icon="bi-person-plus" color="primary" />
        </div>
        <div className="col-md-3">
          <KpiCard title="Conversion" value={`${stats.kpis.conversion_rate}%`} icon="bi-graph-up" color="success" />
        </div>
        <div className="col-md-3">
          <KpiCard title="Active Projects" value={stats.kpis.active_projects} icon="bi-kanban" color="info" />
        </div>
        <div className="col-md-3">
          <KpiCard title="Pending Tasks" value={stats.kpis.pending_tasks} icon="bi-list-check" color="warning" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h6 className="fw-bold mb-4">Company Activity Trend</h6>
            <div style={{ height: '350px' }}>
              <ProjectTrendChart />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h6 className="fw-bold mb-4">Lead Status Distribution</h6>
            <div style={{ height: '350px' }}>
              <LeadStatusChart data={stats.charts.leads} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;