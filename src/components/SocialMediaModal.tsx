"use client";

import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";

type SocialMediaModalProps = {
  open: boolean;
  onClose: () => void;
};

const SocialMediaModal: React.FC<SocialMediaModalProps> = ({ open, onClose }) => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks({ ...socialLinks, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      // Send data to API for updating social media links
      console.log("Submitting social media links:", socialLinks);
    } catch (error) {
      console.error("Error submitting social media links:", error);
    } finally {
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 600,
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Update Social Media Links
        </Typography>
        <TextField
          fullWidth
          label="Facebook URL"
          name="facebook"
          value={socialLinks.facebook}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Instagram URL"
          name="instagram"
          value={socialLinks.instagram}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Twitter URL"
          name="twitter"
          value={socialLinks.twitter}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default SocialMediaModal;
