"use client";

import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

type DashboardCardProps = {
  title: string;
  value: string | number;
};

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value }) => {
  return (
    <Card sx={{ flex: 1, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
