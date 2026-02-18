import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  data: Record<string, number>;
}

export const TaskDistributionChart: React.FC<Props> = ({ data }) => {
  // Mapping statuses to readable labels and enterprise theme colors
  const statusConfig: Record<string, { label: string; color: string }> = {
    todo: { label: 'To Do', color: '#64748b' },         // Slate
    in_progress: { label: 'In Progress', color: '#3b82f6' }, // Blue
    review: { label: 'Review', color: '#06b6d4' },      // Cyan
    blocked: { label: 'Blocked', color: '#ef4444' },    // Red
    done: { label: 'Done', color: '#10b981' },          // Emerald
  };

  const chartData = {
    labels: Object.keys(data).map(key => statusConfig[key]?.label || key.toUpperCase()),
    datasets: [
      {
        label: 'Tasks',
        data: Object.values(data),
        backgroundColor: Object.keys(data).map(key => statusConfig[key]?.color || '#cbd5e1'),
        borderRadius: 6,
        barThickness: 40,
        maxBarThickness: 50,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const, // Horizontal bars for better label readability
    plugins: {
      legend: {
        display: false, // Hide legend as x-axis/y-axis labels are sufficient
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
          color: '#f1f5f9',
        },
        ticks: {
          stepSize: 1,
          font: { size: 11 },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 11, weight: '600' as any },
          color: '#475569',
        },
      },
    },
  };

  return (
    <div className="w-100 h-100">
      <Bar data={chartData} options={options} />
    </div>
  );
};