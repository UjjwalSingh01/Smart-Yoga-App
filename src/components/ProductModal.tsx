"use client";

import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

type ProductType = {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  image: string;
  quantity: number;
  policy: string;
  shippingPolicy: string;
};

type AddProductModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (product: ProductType) => void; 
};

const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose, onAdd }) => {
  const [product, setProduct] = useState({
    _id: "",
    title: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    image: "",
    quantity: 0,
    policy: "",
    shippingPolicy: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onAdd(product);
    setProduct({
      _id:"",
      title: "",
      description: "",
      price: 0,
      discountedPrice: 0,
      image: "",
      quantity: 0,
      policy: "",
      shippingPolicy: "",
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: "background.paper", borderRadius: 2, mx: "auto", mt: 10, width: 500 }}>
        <Typography variant="h6" gutterBottom>
          Add Product
        </Typography>
        <TextField fullWidth label="Title" name="title" value={product.title} onChange={handleChange} />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={product.description}
          onChange={handleChange}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Price"
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Discounted Price"
          name="discountedPrice"
          type="number"
          value={product.discountedPrice}
          onChange={handleChange}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Image URL"
          name="image"
          value={product.image}
          onChange={handleChange}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Quantity"
          name="quantity"
          type="number"
          value={product.quantity}
          onChange={handleChange}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Return Policy"
          name="policy"
          value={product.policy}
          onChange={handleChange}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Shipping Policy"
          name="shippingPolicy"
          value={product.shippingPolicy}
          onChange={handleChange}
          sx={{ mt: 2 }}
        />
        <Button fullWidth variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
          Add Product
        </Button>
      </Box>
    </Modal>
  );
};

export default AddProductModal;
