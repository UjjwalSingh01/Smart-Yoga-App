"use client";

import React, { useState, useEffect } from "react";
import { Container, Button, Box, CircularProgress, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SocialMediaCard from "@/components/SocialMediaCard";
import AddSocialMediaModal from "@/components/SocialMediaModal";
import axios from "axios";

type SocialPost = {
  _id: string;
  platform: string;
  postLink: string;
  mediaType: string;
  mediaUrl: string;
  description: string;
  tags: string[];
  datePosted: string;
};

const SocialPage: React.FC = () => {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Unauthorized");
        }
      try {
        const response = await axios.get<SocialPost[]>("/api/social", {
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

  const handleAddPost = async (newPost: Omit<SocialPost, "_id">) => {
    try {
      const response = await axios.post<SocialPost>("/api/social", newPost);
      setSocialPosts((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error("Failed to add post", error);
    }
  };

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
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setModalOpen(true)}
        sx={{ mb: 4 }}
      >
        Add Post
      </Button>
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
      <AddSocialMediaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddPost}
      />
    </Container>
  );
};

export default SocialPage;
