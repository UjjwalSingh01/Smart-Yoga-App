"use client"

import React from "react";
import Image from "next/image";
import Add from "@/components/Add";
import axios from 'axios';
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  image: string;
  returnPolicy: string;
  shippingPolicy: string;
  quantity: number;
};

// const product: Product = {
//   _id: "1",
//   title: "Yoga Mat",
//   description: "Eco-friendly non-slip yoga mat for all fitness enthusiasts.",
//   price: 49.99,
//   discountedPrice: 39.99,
//   quantity: 3,
//   image: "/images/yoga-mat.jpg",
//   returnPolicy: "30-day return policy.",
//   shippingPolicy: "Free shipping on all orders.",
// };

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [productDetails, setProductDetail] = useState<Product>({
    _id: "",
    title: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    image: "",
    returnPolicy: "",
    shippingPolicy: "",
    quantity: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
    
  useEffect(() => {
    const fetchDetails = async() => {
      const token = localStorage.getItem("token");
      if(!token){
        throw new Error("Unauthorized");
      }
      try {
        const response = await axios.get(`/api/products?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
  
        setProductDetail(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in Fetching Product Details: ", error);
      }
    }

    fetchDetails();
  }, [id])

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <Image
          src={productDetails.image}
          alt={productDetails.title}
          width={400}
          height={400}
          className="rounded-md"
        />
        <div>
          <h1 className="text-3xl font-bold">{productDetails.title}</h1>
          <p className="text-gray-700 mt-4">{productDetails.description}</p>
          <p className="mt-4">
            <span className="text-xl font-bold text-red-500">
              ${productDetails.discountedPrice.toFixed(2)}
            </span>{" "}
            <span className="line-through text-gray-500">
              ${productDetails.price.toFixed(2)}
            </span>
          </p>

          <Add
            productId={productDetails._id!}
            stockNumber={productDetails.quantity || 1}
          />

          <div className="mt-4">
            <p>
              <strong>Return Policy:</strong> {productDetails.returnPolicy}
            </p>
            <p>
              <strong>Shipping Policy:</strong> {productDetails.shippingPolicy}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
