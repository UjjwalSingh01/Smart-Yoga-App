import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/database/mongodb";
import Product from "@/models/Product";

// Establish database connection
async function connectToDatabase() {
  await dbConnect();
}

// GET: Fetch all products
export async function GET(req: NextRequest) {
  await connectToDatabase();
  console.log(req)

  try {
    const products = await Product.find({});
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function GET_BY_ID(req: NextRequest) {
    await connectToDatabase();
  
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
  
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }
  
    try {
      const product = await Product.findById(id);
  
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
  
      return NextResponse.json(product, { status: 200 });
    } catch (error) {
      console.log("Error fetching product:", error);
      return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
  }

// POST: Create a new product
export async function POST(request: NextRequest) {
    try {
      await dbConnect();
  
      const data = await request.json();
  
      const productData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price), 
        discountedPrice: parseFloat(data.discountedPrice),
        image: data.image,
        quantity: parseInt(data.quantity, 10), 
        returnPolicy: data.policy, 
        shippingPolicy: data.shippingPolicy,
      };
  
      const newProduct = await Product.create(productData);
  
      return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
      console.error("Error creating product:", error);
      return NextResponse.json(
        { error: `Failed to create product: ${error}` },
        { status: 500 }
      );
    }
  }

// PATCH: Update an existing product
export async function PATCH(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 400 });
  }
}

// DELETE: Remove a product
export async function DELETE(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 400 });
  }
}
