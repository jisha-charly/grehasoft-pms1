import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: Record<string, number>;
}

const LeadStatusChart: React.FC<Props> = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          "#6c757d", // new
          "#0dcaf0", // contacted
          "#ffc107", // qualified
          "#198754", // converted
          "#dc3545", // lost
        ],
      },
    ],
  };

  return (
    <div style={{ height: 250 }}>
      <Pie data={chartData} options={{ maintainAspectRatio: false }} />
    </div>
  );
};

export default LeadStatusChart;
