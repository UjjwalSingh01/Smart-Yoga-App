import React from "react";
import Image from "next/image";
import Add from "@/components/Add";

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  image: string;
  returnPolicy: string;
  shippingPolicy: string;
  stocks: number;
};

const product: Product = {
  _id: "1",
  title: "Yoga Mat",
  description: "Eco-friendly non-slip yoga mat for all fitness enthusiasts.",
  price: 49.99,
  discountedPrice: 39.99,
  stocks: 3,
  image: "/images/yoga-mat.jpg",
  returnPolicy: "30-day return policy.",
  shippingPolicy: "Free shipping on all orders.",
};

const ProductDetail = () => {
  return (
    <div className="py-8 px-4">
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <Image
          src={product.image}
          alt={product.title}
          width={400}
          height={400}
          className="rounded-md"
        />
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-700 mt-4">{product.description}</p>
          <p className="mt-4">
            <span className="text-xl font-bold text-red-500">
              ${product.discountedPrice.toFixed(2)}
            </span>{" "}
            <span className="line-through text-gray-500">
              ${product.price.toFixed(2)}
            </span>
          </p>

          <Add
            productId={product._id!}
            variantId="00000000-0000-0000-0000-000000000000"
            stockNumber={product.stocks || 0}
          />

          <div className="mt-4">
            <p>
              <strong>Return Policy:</strong> {product.returnPolicy}
            </p>
            <p>
              <strong>Shipping Policy:</strong> {product.shippingPolicy}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
