import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/database/mongodb";
import Cart from "@/models/Cart";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = request.headers.get("userId");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cartItems = await Cart.find({ user: userId }).populate("product");
    return NextResponse.json(cartItems, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to fetch cart items: ${error.message}` }, { status: 500 });
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
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to update cart item: ${error.message}` }, { status: 500 });
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
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to delete cart item: ${error.message}` }, { status: 500 });
  }
}
