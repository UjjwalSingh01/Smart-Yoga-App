"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box, Button } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type SalesChartProps = {
  data: { month: string; sales: number }[];
};

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const [filter, setFilter] = useState<"6" | "12">("12");

  const filteredData = filter === "6" ? data.slice(-6) : data;

  const chartData = {
    labels: filteredData.map((item) => item.month),
    datasets: [
      {
        label: "Sales",
        data: filteredData.map((item) => item.sales),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" as const },
      title: { display: true, text: "Monthly Sales Data" },
    },
  };

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
        <Button
          variant={filter === "6" ? "contained" : "outlined"}
          onClick={() => setFilter("6")}
        >
          Last 6 Months
        </Button>
        <Button
          variant={filter === "12" ? "contained" : "outlined"}
          onClick={() => setFilter("12")}
        >
          Last 12 Months
        </Button>
      </Box>
      <Line data={chartData} options={chartOptions} />
    </Box>
  );
};

export default SalesChart;
