"use client";

import React from "react";
import { Box, Typography, Card, CardMedia, CardContent, Chip, Link } from "@mui/material";

type SocialMediaCardProps = {
  platform: string;
  postLink: string;
  mediaType: string;
  mediaUrl: string;
  description: string;
  tags: string[];
  datePosted: string;
};

const SocialMediaCard: React.FC<SocialMediaCardProps> = ({
  platform,
  postLink,
  mediaType,
  mediaUrl,
  description,
  tags,
  datePosted,
}) => {
  return (
    <Card sx={{ maxWidth: 400, margin: "auto", boxShadow: 3 }}>
      {mediaType === "image" && (
        <CardMedia component="img" height="200" image={mediaUrl} alt={description} />
      )}
      {mediaType === "video" && (
        <CardMedia component="video" controls height="200" src={mediaUrl} />
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {platform}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Posted on: {new Date(datePosted).toLocaleDateString()}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {tags.map((tag, index) => (
            <Chip key={index} label={tag} sx={{ mr: 1 }} />
          ))}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Link href={postLink} target="_blank" rel="noopener" underline="hover">
            View Post
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SocialMediaCard;
