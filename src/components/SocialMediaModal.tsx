"use client";

import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

type AddSocialMediaModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (socialPost: any) => void;
};

const AddSocialMediaModal: React.FC<AddSocialMediaModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [post, setPost] = useState({
    platform: "",
    postLink: "",
    mediaType: "text",
    mediaUrl: "",
    description: "",
    tags: [] as string[],
    datePosted: new Date().toISOString().split("T")[0],
  });

  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag && !post.tags.includes(newTag)) {
      setPost((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      setNewTag("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleMediaTypeChange = (event: SelectChangeEvent<string>) => {
    setPost({ ...post, mediaType: event.target.value as "image" | "video" | "text" });
  };

  const handleSubmit = () => {
    onAdd(post);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          mx: "auto",
          mt: 10,
          width: 500,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add Social Media Post
        </Typography>
        <TextField
          fullWidth
          label="Platform"
          name="platform"
          value={post.platform}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Post Link"
          name="postLink"
          value={post.postLink}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Select
          fullWidth
          value={post.mediaType}
          onChange={handleMediaTypeChange}
          sx={{ mb: 2 }}
        >
          <MenuItem value="image">Image</MenuItem>
          <MenuItem value="video">Video</MenuItem>
          <MenuItem value="text">Text</MenuItem>
        </Select>
        <TextField
          fullWidth
          label="Media URL"
          name="mediaUrl"
          value={post.mediaUrl}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={post.description}
          onChange={handleChange}
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Add Tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button onClick={handleAddTag} sx={{ mb: 2 }}>
          Add Tag
        </Button>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {post.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() =>
                setPost((prev) => ({
                  ...prev,
                  tags: prev.tags.filter((t) => t !== tag),
                }))
              }
            />
          ))}
        </Box>
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Add Post
        </Button>
      </Box>
    </Modal>
  );
};

export default AddSocialMediaModal;
