"use client";

import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BlogCard from "../../components/BlogCard";
import AddBlogModal from "../../components/AddBlogModal";

const initialBlogs = [
  {
    id: 1,
    title: "5 Yoga Poses to Relieve Stress",
    description: "Discover five simple yoga poses to help you unwind.",
    content: "Complete content for 5 Yoga Poses to Relieve Stress...",
    image: "/static/images/yoga-stress.jpg",
    date: "2024-11-20",
    author: "Admin",
    tags: ["stress", "relaxation"],
  },
  {
    id: 2,
    title: "Benefits of Morning Yoga",
    description: "Learn how starting your day with yoga can boost your focus.",
    content: "Complete content for Benefits of Morning Yoga...",
    image: "/static/images/morning-yoga.jpg",
    date: "2024-11-22",
    author: "Admin",
    tags: ["morning", "health"],
  },
];

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showOwnBlogs, setShowOwnBlogs] = useState(false);

  const handleAddBlog = (newBlog: typeof initialBlogs[0]) => {
    setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
    setIsModalOpen(false);
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesDate = filterDate ? blog.date === filterDate : true;
    const matchesOwnBlogs = showOwnBlogs ? blog.author === "Admin" : true;
    return matchesSearch && matchesDate && matchesOwnBlogs;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" className="text-center mb-4">
        Yoga and Wellness Blog
      </Typography>

      {/* Search and Filters */}
      <Box
        sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}
        className="justify-center"
      >
        <TextField
          label="Search Tags or Titles"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          className="max-w-md"
        />
        <TextField
          label="Filter by Date"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          fullWidth
          className="max-w-md"
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant={showOwnBlogs ? "contained" : "outlined"}
          onClick={() => setShowOwnBlogs(!showOwnBlogs)}
        >
          {showOwnBlogs ? "Showing Your Blogs" : "My Blogs"}
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

      {/* Blog List */}
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
            date={blog.date}
            author={blog.author}
            tags={blog.tags}
          />
        ))}
      </Box>

      {/* Add Blog Modal */}
      <AddBlogModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBlog={handleAddBlog}
      />
    </Container>
  );
};

export default BlogPage;
