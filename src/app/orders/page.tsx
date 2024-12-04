"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import OrderCard from "@/components/OrderCard";
import axios from "axios";
import { useSession, signIn } from "next-auth/react";

type Order = {
  id: string; // MongoDB ObjectId
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
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to sign-in if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (status === "authenticated") {
        try {
          const response = await axios.get(`/api/orders`);
          setOrders(response.data); // Axios automatically parses JSON
        } catch (err: any) {
          setError(err.response?.data?.error || "Failed to fetch orders");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [status]);

  const handleReorder = (orderId: string): void => {
    console.log(`Reordered: Order ${orderId}`);
  };

  if (loading || status === "loading") {
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
      {/* Page Header */}
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>

      {/* Orders List */}
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
