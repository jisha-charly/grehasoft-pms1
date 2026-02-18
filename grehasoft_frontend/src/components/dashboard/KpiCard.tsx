import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'secondary';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <div className="card kpi-card border-0 shadow-sm h-100 transition-all">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className={`icon-box bg-${color}-subtle text-${color}`}>
            <i className={`bi ${icon}`}></i>
          </div>
          {trend && (
            <span className={`badge rounded-pill bg-${trend.isPositive ? 'success' : 'danger'}-subtle text-${trend.isPositive ? 'success' : 'danger'} xsmall fw-bold`}>
              {trend.isPositive ? '+' : '-'}{trend.value}%
            </span>
          )}
        </div>
        <h6 className="text-muted small text-uppercase fw-bold mb-1">{title}</h6>
        <h3 className="fw-bold mb-0">{value}</h3>
      </div>
    </div>
  );
};