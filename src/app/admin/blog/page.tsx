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
import { useSession, signIn } from "next-auth/react";

type Blog = {
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

const BlogPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showOwnBlogs, setShowOwnBlogs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (status === "authenticated") {
        try {
          const response = await axios.get(`/api/blogs`, {
            params: { onlyUser: showOwnBlogs },
          });
          setBlogs(response.data);
        } catch (err: any) {
          setError(err.response?.data?.error || "Failed to fetch blogs");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBlogs();
  }, [status, showOwnBlogs]);

  const handleAddBlog = async (newBlog: Omit<Blog, "id" | "creator" | "creatorRole" | "date">) => {
    if (status === "authenticated") {
      try {
        const response = await axios.post(`/api/blogs`, newBlog);
        setBlogs((prevBlogs) => [response.data, ...prevBlogs]);
        setIsModalOpen(false);
      } catch (err: any) {
        console.error("Failed to add blog:", err.response?.data?.error);
      }
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesDate = filterDate ? blog.date === filterDate : true;
    return matchesSearch && matchesDate;
  });

  if (loading || status === "loading") {
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
      <Typography variant="h4" className="text-center mb-4">
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {filteredBlogs.map((blog) => (
          <BlogCard key={blog.id} {...blog} />
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
