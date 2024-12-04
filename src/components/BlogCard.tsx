"use client";

import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";

type BlogCardProps = {
  id: string; 
  title: string;
  description: string;
  content: string;
  image: string;
  date: string;
  creator: string;
  creatorRole: "admin" | "user";
  tags: string[];
};

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  description,
  content,
  image,
  date,
  creator,
  creatorRole,
  tags,
}) => {
  const [showFullContent, setShowFullContent] = useState(false);

  return (
    <Card
      className="shadow-lg hover:shadow-2xl w-full md:w-2/3 transition duration-300"
      sx={{ borderRadius: 2 }}
    >
      {/* Blog Image */}
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{ objectFit: "cover" }}
      />

      {/* Blog Content */}
      <CardContent>
        {/* Title */}
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        {/* Description or Full Content */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {showFullContent ? content : description}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} variant="outlined" />
          ))}
        </Box>

        {/* Creator and Role */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          Posted on {new Date(date).toLocaleDateString()} by {creator} (
          {creatorRole === "admin" ? "Admin" : "User"})
        </Typography>

        {/* Read More/Less Button */}
        <Button
          variant="text"
          color="primary"
          onClick={() => setShowFullContent(!showFullContent)}
          sx={{ mt: 2 }}
        >
          {showFullContent ? "Show Less" : "Read More"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
