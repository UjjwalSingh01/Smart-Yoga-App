"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import OrderCard from "@/components/OrderCard";
import axios from "axios";
import { useRouter } from "next/router";

type Order = {
  id: string; 
  products: {
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  orderedOn: string;
  deliveredOn: string | null;
  status: "DELIVERED" | "SHIPPED" | "PENDING" | "CANCELLED";
  address: string;
};

export default function OrdersPage(): React.ReactElement {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push('/sign-in')
        setError("You must be logged in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleReorder = (orderId: string): void => {
    console.log(`Reordered: Order ${orderId}`);
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
      <Typography
        variant="h3"
        gutterBottom
        textAlign="center"
        sx={{
          fontWeight: "bold",
          mb: 4,
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      >
        Your Orders
      </Typography>

      {orders.map((order) => (
        <OrderCard
          key={order.id}
          orderId={order.id}
          products={order.products}
          totalAmount={order.totalAmount}
          orderedOn={order.orderedOn}
          deliveredOn={order.deliveredOn}
          status={order.status}
          address={order.address}
          onReorder={() => handleReorder(order.id)}
        />
      ))}
    </Container>
  );
}
