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

const dummyBlogs: Blog[] = [
  {
    id: "1",
    title: "The Benefits of Morning Yoga",
    description: "Discover the amazing health benefits of practicing yoga in the morning.",
    content:
      "Morning yoga helps you kickstart your day with energy and positivity. It improves flexibility, reduces stress, and enhances overall well-being. Incorporate simple stretches and mindful breathing to feel rejuvenated.",
    image: "https://via.placeholder.com/600x400?text=Morning+Yoga",
    createdAt: "2024-01-10",
    creator: "John Doe",
    creatorRole: "admin",
    tags: ["yoga", "health", "morning"],
  },
  {
    id: "2",
    title: "5 Essential Yoga Poses for Beginners",
    description: "Learn the foundational yoga poses to start your practice.",
    content:
      "If you're new to yoga, start with poses like Downward Dog, Mountain Pose, and Child's Pose. These are simple yet effective poses that build strength and flexibility. Regular practice will improve your posture and balance.",
    image: "https://via.placeholder.com/600x400?text=Beginner+Yoga",
    createdAt: "2024-01-08",
    creator: "Jane Smith",
    creatorRole: "user",
    tags: ["yoga", "beginner", "poses"],
  },
  {
    id: "3",
    title: "Mindfulness Through Yoga",
    description: "Explore how yoga helps in achieving mindfulness and mental clarity.",
    content:
      "Yoga is not just about physical postures; it's also a mental discipline. Mindfulness through yoga can help reduce anxiety and increase focus. Practices like meditation and slow, intentional movements are great for mental clarity.",
    image: "https://via.placeholder.com/600x400?text=Mindfulness+Yoga",
    createdAt: "2024-01-05",
    creator: "Emily Johnson",
    creatorRole: "admin",
    tags: ["mindfulness", "yoga", "mental health"],
  },
  {
    id: "4",
    title: "Yoga for Better Sleep",
    description: "Techniques and poses to help you sleep better through yoga.",
    content:
      "Struggling with sleep? Yoga can help. Incorporate poses like Legs-Up-The-Wall and Corpse Pose before bed. They help calm the nervous system and prepare your body for restful sleep. Combine with deep breathing exercises for optimal results.",
    image: "https://via.placeholder.com/600x400?text=Yoga+for+Sleep",
    createdAt: "2024-01-03",
    creator: "Mark Lee",
    creatorRole: "user",
    tags: ["yoga", "sleep", "well-being"],
  },
  {
    id: "5",
    title: "The History of Yoga",
    description: "A brief overview of the origins and evolution of yoga.",
    content:
      "Yoga has its roots in ancient India, dating back thousands of years. It started as a spiritual discipline and evolved into the physical practice we know today. Learn about the different paths of yoga and their significance in modern times.",
    image: "https://via.placeholder.com/600x400?text=History+of+Yoga",
    createdAt: "2024-01-01",
    creator: "Sarah Parker",
    creatorRole: "admin",
    tags: ["history", "yoga", "tradition"],
  },
];


const BlogPage: React.FC = () => {
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
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch blogs");
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
    } catch (err: any) {
      console.error("Failed to add blog:", err.response?.data?.error);
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
