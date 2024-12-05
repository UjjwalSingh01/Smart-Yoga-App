import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  image: string;
  quantity: number;
  returnPolicy: string;
  shippingPolicy: string;
};

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onUpdate: (updatedProduct: Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ open, onClose, product, onUpdate }) => {
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(product);

  useEffect(() => {
    setUpdatedProduct(product);
  }, [product]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!updatedProduct) return;

    setUpdatedProduct({
      ...updatedProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    if (updatedProduct) {
      onUpdate(updatedProduct);
    }
  };

  if (!updatedProduct) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={updatedProduct.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={updatedProduct.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Price"
            name="price"
            value={updatedProduct.price}
            onChange={handleChange}
            type="number"
            fullWidth
          />
          <TextField
            label="Discounted Price"
            name="discountedPrice"
            value={updatedProduct.discountedPrice}
            onChange={handleChange}
            type="number"
            fullWidth
          />
          <TextField
            label="Quantity"
            name="quantity"
            value={updatedProduct.quantity}
            onChange={handleChange}
            type="number"
            fullWidth
          />
          <TextField
            label="Image URL"
            name="image"
            value={updatedProduct.image}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="returnPolicy"
            name="returnPolicy"
            value={updatedProduct.returnPolicy}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Shipping Policy"
            name="shippingPolicy"
            value={updatedProduct.shippingPolicy}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
