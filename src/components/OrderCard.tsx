"use client";

import React from "react";
import {
  Card,
  CardMedia,
  Typography,
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
    <Card
      sx={{
        mb: 3,
        p: 3,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h6" gutterBottom>
        <strong>Order ID:</strong> {orderId}
      </Typography>

      {/* Products Section */}
      {products.map((product, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
            alignItems: "center",
            backgroundColor: "#ffffff",
            borderRadius: 1,
            p: 2,
            boxShadow: 1,
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: 80, height: 80, borderRadius: 1 }}
            image={product.productImage}
            alt={product.productName}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {product.productName}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Quantity: {product.quantity}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Price: ${product.price.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      {/* Align Details */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="body2">
            <strong>Total Amount:</strong>{" "}
            <Typography component="span" sx={{ color: "primary.main", fontWeight: "bold" }}>
              ${totalAmount.toFixed(2)}
            </Typography>
          </Typography>
          <Typography variant="body2">
            <strong>Address:</strong> {address}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="body2">
            <strong>Ordered On:</strong> {orderedOn}
          </Typography>
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
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Reorder Button */}
      <Box sx={{ textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onReorder}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Reorder
        </Button>
      </Box>
    </Card>
  );
}
