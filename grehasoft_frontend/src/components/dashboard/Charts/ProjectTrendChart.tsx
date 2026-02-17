import React from "react";
import { Doughnut } from "react-chartjs-2";
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

const ProjectTrendChart: React.FC<Props> = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          "#0d6efd", // active
          "#198754", // completed
          "#ffc107", // on_hold
          "#6c757d", // archived
        ],
      },
    ],
  };

  return (
    <div style={{ height: 250 }}>
      <Doughnut
        data={chartData}
        options={{
          maintainAspectRatio: false,
          cutout: "65%",
        }}
      />
    </div>
  );
};

export default ProjectTrendChart;
