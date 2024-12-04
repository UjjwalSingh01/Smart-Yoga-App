"use client";

import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";

interface AddAdminModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (adminData: {
    fullname: string;
    email: string;
    password: string;
    role: string;
  }) => void;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "editor",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      onAdd(formData);
      setFormData({
        fullname: "",
        email: "",
        password: "",
        role: "editor",
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add admin.");
    } finally {
      setLoading(false);
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
          width: "100%",
          maxWidth: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
          Add New Admin
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <TextField
          name="fullname"
          label="Full Name"
          fullWidth
          value={formData.fullname}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          name="email"
          label="Email"
          fullWidth
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          name="password"
          label="Password"
          fullWidth
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
        />
        <Select
          name="role"
          value={formData.role}
          onChange={handleSelectChange}
          fullWidth
          sx={{ mb: 3 }}
        >
          <MenuItem value="editor">Editor</MenuItem>
          <MenuItem value="superadmin">Super Admin</MenuItem>
        </Select>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{
            py: 1.5,
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
            "&:hover": {
              backgroundColor: "#004aad",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Admin"}
        </Button>
      </Box>
    </Modal>
  );
};

export default AddAdminModal;
