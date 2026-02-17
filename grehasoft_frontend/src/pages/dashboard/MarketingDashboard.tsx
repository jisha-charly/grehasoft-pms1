import React, { useEffect, useState } from 'react';
import { reportService, DashboardStats } from '../../api/report.service';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { LeadStatusChart } from '../../components/dashboard/Charts/LeadStatusChart';
import Spinner from '../../components/common/Spinner';

const MarketingDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getDashboardStats('digital_marketing').then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) return <Spinner center />;

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold text-success">Marketing & Sales Panel</h2>
        <p className="text-muted">Lead funnel and ROI tracking.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <KpiCard title="Total Leads" value={stats.kpis.total_leads} icon="bi-megaphone" color="success" />
        </div>
        <div className="col-md-4">
          <KpiCard title="Qualified" value={stats.charts.leads['qualified'] || 0} icon="bi-award" color="warning" />
        </div>
        <div className="col-md-4">
          <KpiCard title="Win Rate" value={`${stats.kpis.conversion_rate}%`} icon="bi-trophy" color="primary" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4">
            <h6 className="fw-bold mb-4">Lead Status Pipeline</h6>
            <div style={{ height: '300px' }}>
              <LeadStatusChart data={stats.charts.leads} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 bg-primary text-white p-4 h-100 shadow-sm">
            <h6 className="fw-bold mb-3">Conversion Pro-Tip</h6>
            <p className="small opacity-75">Your qualified leads have increased by 12% this month. Ensure your Sales Executives follow up within 24 hours to maintain the current win rate.</p>
            <button className="btn btn-light btn-sm fw-bold mt-auto">View Lead History</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingDashboard;