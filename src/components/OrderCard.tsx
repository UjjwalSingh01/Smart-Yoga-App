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
  productImage: string;
  productName: string;
  cost: string;
  orderedOn: string;
  deliveredOn: string | null; // Null if not yet delivered
  status: "DELIVERED" | "ARRIVING" | "CANCELLED";
  address: string;
  onReorder: () => void;
};

export default function OrderCard({
  productImage,
  productName,
  cost,
  orderedOn,
  deliveredOn,
  status,
  address,
  onReorder,
}: OrderCardProps) {
  return (
    <Card sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, mb: 3 }}>
      {/* Product Image */}
      <CardMedia
        component="img"
        sx={{ width: { xs: "100%", sm: 160 }, height: { sm: 160 } }}
        image={productImage}
        alt={productName}
      />

      {/* Order Details */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CardContent>
          {/* Product Name */}
          <Typography variant="h6" gutterBottom>
            {productName}
          </Typography>

          {/* Cost and Order Dates */}
          <Typography variant="body2" color="text.secondary">
            <strong>Cost:</strong> {cost}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Ordered On:</strong> {orderedOn}
          </Typography>
          {deliveredOn && (
            <Typography variant="body2" color="text.secondary">
              <strong>Delivered On:</strong> {deliveredOn}
            </Typography>
          )}

          {/* Status */}
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color:
                status === "DELIVERED"
                  ? "green"
                  : status === "ARRIVING"
                  ? "orange"
                  : "red",
            }}
          >
            <strong>Status:</strong> {status}
          </Typography>

          {/* Address */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            <strong>Address:</strong> {address}
          </Typography>
        </CardContent>

        {/* Reorder Button */}
        <CardActions sx={{ mt: "auto", pl: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onReorder}
          >
            Reorder
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
}
