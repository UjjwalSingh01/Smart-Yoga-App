"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography, Box, CircularProgress, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import DashboardCard from "@/components/DashboardCard";
import SalesChart from "@/components/SalesChart";
import AddAdminModal from "@/components/AddAdminModal";

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

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized access. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<SalesData>("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch data.");
        console.log(err);
      } 
        setLoading(false);
    
    };

    fetchData();
  }, []);

  const handleAddAdmin = async (adminData: { fullname: string; email: string; password: string; role: string }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized access. Please log in.");
      return;
    }

    try {
      await axios.post("/api/admin/register", adminData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Admin added successfully!");
      setIsAddAdminOpen(false); 
    } catch (err) {
      alert("Failed to add admin.");
      console.log(err);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsAddAdminOpen(true)}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
            "&:hover": {
              backgroundColor: "#004aad",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            },
          }}
        >
          Add Admin
        </Button>
      </Box>

      {/* Products Sold */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Products Sold
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "space-between" }}>
          <DashboardCard title="This Week" value={data?.productsSold.week || 0} />
          <DashboardCard title="This Month" value={data?.productsSold.month || 0} />
          <DashboardCard title="This Year" value={data?.productsSold.year || 0} />
        </Box>
      </Box>

      {/* Total Sales */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Total Sales
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "space-between" }}>
          <DashboardCard title="This Week" value={`$${data?.sales.week.toFixed(2) || 0}`} />
          <DashboardCard title="This Month" value={`$${data?.sales.month.toFixed(2) || 0}`} />
          <DashboardCard title="This Year" value={`$${data?.sales.year.toFixed(2) || 0}`} />
        </Box>
      </Box>

      {/* Sales Over Time */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Sales Over Time
        </Typography>
        <SalesChart data={data?.salesByMonth || []} />
      </Box>

      {/* Add Admin Modal */}
      <AddAdminModal
        open={isAddAdminOpen}
        onClose={() => setIsAddAdminOpen(false)}
        onAdd={handleAddAdmin}
      />
    </Container>
  );
};

export default AdminDashboard;
