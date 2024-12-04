"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useSession, signIn } from "next-auth/react";

type CartItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
};

const CartPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to sign-in if unauthenticated
    if (status === "unauthenticated") {
        signIn();
        return;
    }

    const fetchCartItems = async () => {
      if (status === "authenticated") {
        try {
          const response = await axios.get(`/api/cart`);
          setCartItems(response.data);
        } catch (err: any) {
          setError(err.response?.data?.error || "Failed to fetch cart items");
        } 
          
        setLoading(false);
        
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (id: string, value: string) => {
    const updatedQuantity = Math.max(1, parseInt(value) || 1);
    try {
      await axios.put(`/api/cart`, { 
        _id: id, 
        quantity: updatedQuantity 
      });
      
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === id ? { ...item, quantity: updatedQuantity } : item
        )
      );
    } catch (err: any) {
      console.error("Failed to update quantity:", err.response?.data?.error);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await axios.delete(`/api/cart`, { 
        params: { id } 
      });

      setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
    
    } catch (err: any) {
      console.error("Failed to remove item:", err.response?.data?.error);
    }
  };

  const calculateTotal = (): string =>
    cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

  if (loading || status === "loading") {
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
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          Your cart is empty. Start shopping now!
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          <Box sx={{ flex: 2, display: "flex", flexDirection: "column" }}>
            {cartItems.map((item) => (
              <Card key={item._id} sx={{ display: "flex", mb: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 140, height: 140 }}
                  image={item.image}
                  alt={item.name}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Price: ${item.price.toFixed(2)}
                  </Typography>
                  <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    <TextField
                      label="Quantity"
                      type="number"
                      size="small"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item._id, e.target.value)
                      }
                      sx={{ width: 80, mr: 2 }}
                    />
                    <IconButton color="error" onClick={() => handleRemoveItem(item._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">${calculateTotal()}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1">Free</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">${calculateTotal()}</Typography>
              </Box>
              <Button variant="contained" color="primary" fullWidth>
                Checkout
              </Button>
            </Card>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
