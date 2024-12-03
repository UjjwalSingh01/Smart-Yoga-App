"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import OrderCard from "@/components/OrderCard";
import axios from "axios";

type Order = {
  id: number;
  productImage: string;
  productName: string;
  cost: string;
  orderedOn: string;
  deliveredOn: string | null;
  status: "DELIVERED" | "ARRIVING" | "CANCELLED";
  address: string;
};

// Mock data for orders
const orders: Order[] = [
  {
    id: 1,
    productImage: "/static/images/yoga-mat.jpg",
    productName: "Yoga Mat",
    cost: "$49.99",
    orderedOn: "2024-11-20",
    deliveredOn: "2024-11-25",
    status: "DELIVERED",
    address: "123 Yoga Street, Wellness City, WC 12345",
  },
  {
    id: 2,
    productImage: "/static/images/yoga-blocks.jpg",
    productName: "Yoga Blocks",
    cost: "$29.99",
    orderedOn: "2024-11-22",
    deliveredOn: null,
    status: "ARRIVING",
    address: "456 Health Avenue, Fitness Town, FT 67890",
  },
  {
    id: 3,
    productImage: "/static/images/yoga-strap.jpg",
    productName: "Smart Yoga Strap",
    cost: "$79.99",
    orderedOn: "2024-11-15",
    deliveredOn: "2024-11-20",
    status: "CANCELLED",
    address: "789 Balance Road, Calm City, CC 10111",
  },
];

export default function OrdersPage(): React.ReactElement {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    const userId = "YOUR_USER_ID"; // Replace with actual user ID from authentication context
  
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`/api/orders`, {
            params: { userId }, // Pass userId as a query parameter
          });
          setOrders(response.data); // Axios automatically parses JSON
          setLoading(false);
        } catch (err: any) {
          setError(err.response?.data?.error || "Failed to fetch orders");
          setLoading(false);
        }
      };
  
      fetchOrders();
    }, []);
  
    const handleReorder = (productName: string): void => {
      console.log(`Reordered: ${productName}`);
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
      {/* Page Header */}
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>

      {/* Orders List */}
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          productImage={order.productImage}
          productName={order.productName}
          cost={order.cost}
          orderedOn={order.orderedOn}
          deliveredOn={order.deliveredOn}
          status={order.status}
          address={order.address}
          onReorder={() => handleReorder(order.productName)}
        />
      ))}
    </Container>
  );
}
