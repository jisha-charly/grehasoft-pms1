import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface Props {
  labels: string[];
  values: number[];
}

const ConversionRateChart: React.FC<Props> = ({ labels, values }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Conversion %",
        data: values,
        borderColor: "#198754",
        backgroundColor: "rgba(25, 135, 84, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div style={{ height: 250 }}>
      <Line data={chartData} options={{ maintainAspectRatio: false }} />
    </div>
  );
};

export default ConversionRateChart;
