import React, { useEffect, useState } from 'react';
import { reportService, DashboardStats } from '../../api/report.service';
import { Spinner } from '../../components/common/Spinner';
import { Card } from '../../components/common/Card';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const SoftwareDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await reportService.getDashboardStats('software');
        setData(response.data);
      } catch (error) {
        console.error('Software dashboard error:', error);
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
        <h2 className="fw-bold">Software Department Dashboard</h2>
        <p className="text-muted">Project & task performance overview</p>
      </div>

      {/* KPIs */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <Card>
            <h6 className="text-muted small">Active Projects</h6>
            <h3 className="fw-bold text-primary">
              {kpis.active_projects}
            </h3>
          </Card>
        </div>

        <div className="col-md-6">
          <Card>
            <h6 className="text-muted small">Pending Tasks</h6>
            <h3 className="fw-bold text-warning">
              {kpis.pending_tasks}
            </h3>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4">

        {/* Projects Chart */}
        <div className="col-md-6">
          <Card>
            <h6 className="fw-bold mb-3">Projects by Status</h6>
            <div style={{ height: 300 }}>
              <Doughnut
                data={{
                  labels: Object.keys(charts.projects),
                  datasets: [{
                    data: Object.values(charts.projects),
                    backgroundColor: [
                      '#0d6efd',
                      '#198754',
                      '#ffc107',
                      '#6c757d'
                    ]
                  }]
                }}
                options={{
                  maintainAspectRatio: false,
                  cutout: '70%'
                }}
              />
            </div>
          </Card>
        </div>

        {/* Tasks Chart */}
        <div className="col-md-6">
          <Card>
            <h6 className="fw-bold mb-3">Task Distribution</h6>
            <div style={{ height: 300 }}>
              <Bar
                data={{
                  labels: Object.keys(charts.tasks),
                  datasets: [{
                    label: 'Tasks',
                    data: Object.values(charts.tasks),
                    backgroundColor: '#0d6efd',
                    borderRadius: 6
                  }]
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default SoftwareDashboard;
