import React from "react";
import Link from "next/link";

type Product = {
  _id: string;
  title: string;
  price: number;
  discountedPrice: number;
  image: string;
};

type ProductDetail = {
  _id: string;
  title: string;
  price: number;
  discountedPrice: number;
  image: string;
  slug: string;
}

type ProductCardProps = {
  product: Product;
  addToCart: (id: string) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  const productInfo: ProductDetail = {
    ... product,
    slug: product.title
  }

  return (
    <Link
      href={{
        pathname: `/${productInfo.slug}`,
        query: { id: productInfo._id },
      }}
      className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
    >
      <div className="relative w-full h-80">
        <img
          src="image/product.jpg"
          alt={productInfo.title || "Product"}
          // fill
          sizes="25vw"
          className="absolute object-cover rounded-md"
        />
      </div>
      <div className="flex justify-between">
        <span className="font-medium">{productInfo.title}</span>
        <span className="font-semibold">${productInfo.discountedPrice.toFixed(2)}</span>
      </div>
      <button
        className="rounded-2xl ring-1 ring-blue-500 text-blue-500 w-max py-2 px-4 text-xs hover:bg-blue-500 hover:text-white"
        onClick={(e) => {
          e.preventDefault();
          addToCart(productInfo._id);
        }}
      >
        Add to Cart
      </button>
    </Link>
  );
};

export default ProductCard;
