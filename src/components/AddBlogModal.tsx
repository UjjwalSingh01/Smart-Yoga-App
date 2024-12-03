"use client";

import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
} from "@mui/material";

type AddBlogModalProps = {
  open: boolean;
  onClose: () => void;
  onAddBlog: (blog: {
    id: number;
    title: string;
    description: string;
    content: string;
    image: string;
    date: string;
    author: string;
    tags: string[];
  }) => void;
};

const AddBlogModal: React.FC<AddBlogModalProps> = ({ open, onClose, onAddBlog }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleSubmit = () => {
    onAddBlog({
      id: Date.now(),
      title,
      description,
      content,
      image,
      date: new Date().toISOString().split("T")[0],
      author: "Admin",
      tags,
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg p-6 shadow-lg"
      >
        <Typography variant="h5" gutterBottom>
          Create New Blog
        </Typography>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          rows={4}
          className="mb-4"
        />
        <TextField
          label="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          fullWidth
          className="mb-4"
        />
        <Box className="mb-4">
          <TextField
            label="Add Tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="mr-2"
          />
          <Button onClick={handleAddTag}>Add</Button>
        </Box>
        <Box className="mb-4">
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => setTags(tags.filter((t) => t !== tag))}
              className="mr-1"
            />
          ))}
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default AddBlogModal;
