import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  data: Record<string, number>;
}

const TaskDistributionChart: React.FC<Props> = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Tasks",
        data: Object.values(data),
        backgroundColor: "#0d6efd",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div style={{ height: 250 }}>
      <Bar
        data={chartData}
        options={{
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
        }}
      />
    </div>
  );
};

export default TaskDistributionChart;
