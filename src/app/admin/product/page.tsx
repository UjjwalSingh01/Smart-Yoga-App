"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Button, Card, CardContent, CardMedia } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddProductModal from "@/components/ProductModal";
import axios from "axios";

type Product = {
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



const AdminProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (product: Product) => {
    try {
      const response = await axios.post("/api/products", product);
      setProducts((prevProducts) => [...prevProducts, response.data]);
      setAddModalOpen(false);
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prevProducts) => prevProducts.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
    <Typography variant="h4" gutterBottom textAlign="center">
      Manage Products
    </Typography>

    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() => setAddModalOpen(true)}
      sx={{ mb: 4, display: "block", mx: "auto" }}
    >
      Add Product
    </Button>

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      {products.map((product) => (
        <Card
          key={product._id}
          sx={{
            width: "100%",
            maxWidth: 600,
            display: "flex",
            flexDirection: "column",
            boxShadow: 3,
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: 6,
            },
            borderRadius: 2,
          }}
        >
          <CardMedia
            component="img"
            image={product.image}
            alt={product.title}
            sx={{
              height: 200,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {product.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {product.description}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Price: ${product.price} | Discounted: ${product.discountedPrice}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Quantity: {product.quantity}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Policy: {product.policy}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Shipping Policy: {product.shippingPolicy}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
              <Button variant="contained" color="error" onClick={() => handleDeleteProduct(product._id)}>
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>

    <AddProductModal
      open={isAddModalOpen}
      onClose={() => setAddModalOpen(false)}
      onAdd={handleAddProduct}
    />
  </Container>
  );
};

export default AdminProductPage;
