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

  try {
    const products = await Product.find({});
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: Create a new product
export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 400 });
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
