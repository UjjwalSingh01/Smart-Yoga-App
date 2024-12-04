"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Button, Card, CardContent, CardMedia } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddProductModal from "@/components/ProductModal";
import EditProductModal from "@/components/ProductModal";
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
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const handleEditProduct = async (product: Product) => {
    try {
      const response = await axios.patch(`/api/products/${product._id}`, product);
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p._id === product._id ? response.data : p))
      );
      setEditModalOpen(false);
    } catch (err) {
      console.error("Failed to edit product:", err);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Products
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setAddModalOpen(true)}
        sx={{ mb: 4 }}
      >
        Add Product
      </Button>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {products.map((product) => (
          <Card key={product._id} sx={{ width: 300 }}>
            <CardMedia
              component="img"
              image={product.image}
              alt={product.title}
              sx={{ height: 200 }}
            />
            <CardContent>
              <Typography variant="h6">{product.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
              <Typography variant="body1">
                Price: ${product.price} | Discounted Price: ${product.discountedPrice}
              </Typography>
              <Typography variant="body2">Quantity: {product.quantity}</Typography>
              <Typography variant="body2">Policy: {product.policy}</Typography>
              <Typography variant="body2">Shipping Policy: {product.shippingPolicy}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setSelectedProduct(product);
                  setEditModalOpen(true);
                }}
                sx={{ mt: 2, mr: 1 }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteProduct(product._id)}
                sx={{ mt: 2 }}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddProduct}
      />
      {selectedProduct && (
        <EditProductModal
          open={isEditModalOpen}
          onAdd={handleAddProduct}
          onClose={() => setEditModalOpen(false)}
          // product={selectedProduct}
          // onEdit={handleEditProduct}
        />
      )}
    </Container>
  );
};

export default AdminProductPage;
