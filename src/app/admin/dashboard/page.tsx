"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import DashboardCard from "@/components/DashboardCard";
import SalesChart from "@/components/SalesChart";

interface SalesData {
  productsSold: {
    week: number;
    month: number;
    year: number;
  };
  sales: {
    week: number;
    month: number;
    year: number;
  };
  salesByMonth: { month: string; sales: number }[];
}

const dummyData: SalesData = {
    productsSold: {
      week: 120,
      month: 450,
      year: 5420,
    },
    sales: {
      week: 3000.75,
      month: 11250.40,
      year: 135000.00,
    },
    salesByMonth: [
      { month: "Dec", sales: 12000.00 },
      { month: "Nov", sales: 9500.50 },
      { month: "Oct", sales: 11000.00 },
      { month: "Sep", sales: 8500.75 },
      { month: "Aug", sales: 9700.00 },
      { month: "Jul", sales: 10450.25 },
      { month: "Jun", sales: 11500.00 },
      { month: "May", sales: 12200.80 },
      { month: "Apr", sales: 10800.50 },
      { month: "Mar", sales: 9500.25 },
      { month: "Feb", sales: 8700.10 },
      { month: "Jan", sales: 10000.00 },
    ],
  };
  

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<SalesData | null>(dummyData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get<SalesData>("/api/admin/dashboard");
//         setData(response.data);
//       } catch (err: any) {
//         setError(err.response?.data?.error || "Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Part 1: Number of Products Sold */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Number of Products Sold
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "space-between",
          }}
        >
          <DashboardCard title="This Week" value={data?.productsSold.week || 0} />
          <DashboardCard title="This Month" value={data?.productsSold.month || 0} />
          <DashboardCard title="This Year" value={data?.productsSold.year || 0} />
        </Box>
      </Box>

      {/* Part 2: Total Sales */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Total Sales
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "space-between",
          }}
        >
          <DashboardCard title="This Week" value={`$${data?.sales.week.toFixed(2) || 0}`} />
          <DashboardCard title="This Month" value={`$${data?.sales.month.toFixed(2) || 0}`} />
          <DashboardCard title="This Year" value={`$${data?.sales.year.toFixed(2) || 0}`} />
        </Box>
      </Box>

      {/* Part 3: Sales Chart */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Sales Over Time
        </Typography>
        <SalesChart data={data?.salesByMonth || []} />
      </Box>
    </Container>
  );
};

export default AdminDashboard;
