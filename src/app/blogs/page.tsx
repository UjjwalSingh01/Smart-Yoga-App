"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BlogCard from "@/components/BlogCard";
import AddBlogModal from "@/components/AddBlogModal";
import axios from "axios";
import { useRouter } from "next/router";

type Blog = {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  createdAt: string;
  creator: string;
  creatorRole: "admin" | "user";
  tags: string[];
};

const BlogPage: React.FC = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showOwnBlogs, setShowOwnBlogs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/sign-in')
        setError("Unauthorized. Please sign in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/blogs`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { onlyUser: showOwnBlogs },
        });
        setBlogs(response.data);
      } catch (err) {
        console.log(err)
        setError("Failed to fetch blogs");
      } 
      setLoading(false);
      
    };

    fetchBlogs();
  }, [showOwnBlogs]);

  const handleAddBlog = async (newBlog: Omit<Blog, "id" | "creator" | "creatorRole" | "createdAt">) => {
    const token = await localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please sign in.");
      return;
    }

    try {
      const response = await axios.post(`/api/blogs`, newBlog, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs((prevBlogs) => [response.data, ...prevBlogs]);
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      console.error("Failed to add blog:");
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesDate = filterDate ? blog.createdAt === filterDate : true;
    return matchesSearch && matchesDate;
  });

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
      <Typography variant="h4" textAlign="center" sx={{ mb: 4 }}>
        Yoga and Wellness Blog
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
        <TextField
          label="Search Tags or Titles"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <TextField
          label="Filter by Date"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant={showOwnBlogs ? "contained" : "outlined"}
          onClick={() => setShowOwnBlogs(!showOwnBlogs)}
        >
          {showOwnBlogs ? "Showing Your Blogs" : "Show My Blogs"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Create New Blog
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
        }}
      >
        {filteredBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            id={blog.id}
            title={blog.title}
            description={blog.description}
            content={blog.content}
            image={blog.image}
            date={blog.createdAt}
            creator={blog.creator}
            creatorRole={blog.creatorRole}
            tags={blog.tags}
          />
        ))}
      </Box>

      <AddBlogModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBlog={handleAddBlog}
      />
    </Container>
  );
};

export default BlogPage;
