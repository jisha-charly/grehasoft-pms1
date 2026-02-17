import React, { useEffect, useState } from 'react';
import { reportService, DashboardStats } from '../../api/report.service';
import { Spinner } from '../../components/common/Spinner';
import { Card } from '../../components/common/Card';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const MarketingDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await reportService.getDashboardStats('digital_marketing');
        setData(response.data);
      } catch (error) {
        console.error('Marketing dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Spinner fullScreen />;

  if (!data) {
    return <div className="alert alert-danger">Failed to load data.</div>;
  }

  const { kpis, charts } = data;

  return (
    <div className="container-fluid">

      <div className="mb-4">
        <h2 className="fw-bold">Marketing Dashboard</h2>
        <p className="text-muted">Lead performance & conversion analytics</p>
      </div>

      {/* KPIs */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <Card>
            <h6 className="text-muted small">Total Leads</h6>
            <h3 className="fw-bold">{kpis.total_leads}</h3>
          </Card>
        </div>

        <div className="col-md-4">
          <Card>
            <h6 className="text-muted small">Conversion Rate</h6>
            <h3 className="fw-bold text-success">
              {kpis.conversion_rate}%
            </h3>
          </Card>
        </div>

        <div className="col-md-4">
          <Card>
            <h6 className="text-muted small">Active Projects</h6>
            <h3 className="fw-bold text-primary">
              {kpis.active_projects}
            </h3>
          </Card>
        </div>
      </div>

      {/* Leads Pie Chart */}
      <div className="row">
        <div className="col-md-6">
          <Card>
            <h6 className="fw-bold mb-3">Leads by Status</h6>
            <div style={{ height: 300 }}>
              <Pie
                data={{
                  labels: Object.keys(charts.leads),
                  datasets: [{
                    data: Object.values(charts.leads),
                    backgroundColor: [
                      '#0d6efd',
                      '#198754',
                      '#ffc107',
                      '#dc3545',
                      '#6c757d'
                    ]
                  }]
                }}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default MarketingDashboard;
