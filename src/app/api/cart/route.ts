import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/database/mongodb";
import Cart from "@/models/Cart";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = request.headers.get("userId");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cartItems = await Cart.find({ user: userId }).populate("product");
    
    const transformedCartItems = cartItems.map((item) => ({
      _id: item._id,
      name: item.product.title,
      description: item.product.description,
      price: item.product.discountedPrice,
      quantity: item.quantity,
      image: item.product.image,
    }));
    
    return NextResponse.json(transformedCartItems, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch cart items: ${error}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.headers.get("userId");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();

    const existingCartItem = await Cart.findOne({ user: userId, product: id });

    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
      return NextResponse.json(existingCartItem, { status: 200 });
    }

    const newCartItem = await Cart.create({
      user: userId,
      product: id,
      quantity: 1
    });

    return NextResponse.json(newCartItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to add item to cart: ${error}` },
      { status: 500 }
    );
  }
}


export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const userId = request.headers.get("userId");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { _id, quantity } = await request.json();
    const updatedItem = await Cart.findOneAndUpdate(
      { _id, user: userId },
      { quantity },
      { new: true }
    );

    if (!updatedItem) return NextResponse.json({ error: "Item not found or not authorized" }, { status: 404 });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to update cart item: ${error}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const userId = request.headers.get("userId");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const deletedItem = await Cart.findOneAndDelete({ _id: id, user: userId });
    if (!deletedItem) return NextResponse.json({ error: "Item not found or not authorized" }, { status: 404 });

    return NextResponse.json({ message: "Item removed successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete cart item: ${error}` }, { status: 500 });
  }
}
