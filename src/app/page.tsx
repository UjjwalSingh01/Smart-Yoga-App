"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "@/components/ProductCard";

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
  slug: string
};


export default function Home() {
  const [_, setCart] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 2;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>("/api/products");
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch products");
      console.log(err)
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const addToCart = (id: string) => {
    setCart((prevCart) => [...prevCart, id]);
    alert("Product added to cart!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-blue-500 text-white text-center py-8">
        <h1 className="text-4xl font-bold">Welcome to Smart Yoga Products</h1>
        <p className="mt-2">Explore the best yoga gear for your wellness journey.</p>
      </div>
      <div className="py-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Our Products</h2>
        <div className="flex flex-wrap gap-4">
          {paginatedProducts.map((product) => (
            <ProductCard key={product._id} product={product} addToCart={addToCart} />
          ))}
        </div>
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
