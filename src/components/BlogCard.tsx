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
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  date: string;
  author: string;
  tags: string[];
};

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  description,
  content,
  image,
  date,
  author,
  tags,
}) => {
  const [showFullContent, setShowFullContent] = useState(false);

  return (
    <Card className="shadow-lg hover:shadow-2xl w-2/3 transition duration-300">
      <CardMedia component="img" height="140" image={image} alt={title} />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {showFullContent ? content : description}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} variant="outlined" />
          ))}
        </Box>
        <Typography variant="caption" color="text.secondary">
          Posted on {date} by {author}
        </Typography>
        <Button
          variant="text"
          color="primary"
          onClick={() => setShowFullContent(!showFullContent)}
          className="mt-2"
        >
          {showFullContent ? "Show Less" : "Read More"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
