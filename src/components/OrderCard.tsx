"use client";

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Divider,
} from "@mui/material";

type OrderCardProps = {
  orderId: string;
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
  onReorder: () => void;
};

export default function OrderCard({
  orderId,
  products,
  totalAmount,
  orderedOn,
  deliveredOn,
  status,
  address,
  onReorder,
}: OrderCardProps) {
  return (
    <Card sx={{ mb: 3, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Order ID: {orderId}
      </Typography>

      {/* Products Section */}
      {products.map((product, index) => (
        <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
          <CardMedia
            component="img"
            sx={{ width: 100, height: 100 }}
            image={product.productImage}
            alt={product.productName}
          />
          <Box>
            <Typography variant="subtitle1">{product.productName}</Typography>
            <Typography variant="body2">Quantity: {product.quantity}</Typography>
            <Typography variant="body2">Price: ${product.price.toFixed(2)}</Typography>
          </Box>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      {/* Order Details */}
      <Typography variant="body2">
        <strong>Ordered On:</strong> {orderedOn}
      </Typography>
      {deliveredOn && (
        <Typography variant="body2">
          <strong>Delivered On:</strong> {deliveredOn}
        </Typography>
      )}
      <Typography
        variant="body2"
        sx={{
          color:
            status === "DELIVERED"
              ? "green"
              : status === "SHIPPED"
              ? "blue"
              : status === "PENDING"
              ? "orange"
              : "red",
        }}
      >
        <strong>Status:</strong> {status}
      </Typography>

      <Typography variant="body2" sx={{ my: 2 }}>
        <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
      </Typography>

      <Typography variant="body2">
        <strong>Address:</strong> {address}
      </Typography>

      <CardActions>
        <Button variant="contained" color="primary" onClick={onReorder}>
          Reorder
        </Button>
      </CardActions>
    </Card>
  );
}
