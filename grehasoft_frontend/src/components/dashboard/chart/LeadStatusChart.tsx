import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: Record<string, number>;
}

export const LeadStatusChart: React.FC<Props> = ({ data }) => {
  const chartData = {
    labels: Object.keys(data).map(label => label.toUpperCase()),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          '#3b82f6', // info
          '#10b981', // success
          '#f59e0b', // warning
          '#ef4444', // danger
          '#64748b', // secondary
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 11, weight: '600' as any },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 13 },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};