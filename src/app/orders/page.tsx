"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import OrderCard from "@/components/OrderCard";
import axios from "axios";

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

const dummyOrders: Order[] = [
  {
    id: "order1",
    products: [
      {
        productName: "Yoga Mat",
        productImage: "https://via.placeholder.com/100x100?text=Yoga+Mat",
        quantity: 1,
        price: 39.99,
      },
      {
        productName: "Yoga Blocks",
        productImage: "https://via.placeholder.com/100x100?text=Yoga+Blocks",
        quantity: 2,
        price: 19.99,
      },
    ],
    totalAmount: 79.97,
    orderedOn: "2024-01-01",
    deliveredOn: "2024-01-05",
    status: "DELIVERED",
    address: "123 Yoga Lane, Wellness City, YG 12345",
  },
  {
    id: "order2",
    products: [
      {
        productName: "Yoga Strap",
        productImage: "https://via.placeholder.com/100x100?text=Yoga+Strap",
        quantity: 3,
        price: 15.99,
      },
    ],
    totalAmount: 47.97,
    orderedOn: "2024-01-10",
    deliveredOn: null,
    status: "SHIPPED",
    address: "456 Zen Street, Fitness Town, ZN 67890",
  },
  {
    id: "order3",
    products: [
      {
        productName: "Yoga Wheel",
        productImage: "https://via.placeholder.com/100x100?text=Yoga+Wheel",
        quantity: 1,
        price: 29.99,
      },
    ],
    totalAmount: 29.99,
    orderedOn: "2024-01-15",
    deliveredOn: null,
    status: "PENDING",
    address: "789 Serenity Avenue, Harmony Village, SM 11223",
  },
];

export default function OrdersPage(): React.ReactElement {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
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
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch orders");
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
