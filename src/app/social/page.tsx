"use client";

import React, { useState, useEffect } from "react";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import SocialMediaCard from "@/components/SocialMediaCard";
import axios from "axios";

type SocialPost = {
  _id: string;
  platform: string;
  postLink: string;
  mediaType: "image" | "video" | "text";
  mediaUrl: string;
  description: string;
  tags: string[];
  datePosted: string;
};


const SocialPage: React.FC = () => {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Unauthorized");
            }
        try {
            const response = await axios.get("/api/social", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSocialPosts(response.data);
        } catch (error) {
            console.error("Failed to fetch social media posts", error);
        }
            setLoading(false);
    };

    fetchPosts();
  }, []);


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
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
        Social Media Highlights
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        {socialPosts.map((post) => (
          <Box key={post._id} sx={{ width: "100%", maxWidth: "600px" }}>
            <SocialMediaCard {...post} />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default SocialPage;
