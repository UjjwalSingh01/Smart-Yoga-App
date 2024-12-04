import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/database/mongodb";
import Cart from "@/models/Cart";

// GET /api/cart - Fetch cart items for authenticated user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const cartItems = await Cart.find({ user: userId }).populate("product");

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to fetch cart items: ${error.message}` }, { status: 500 });
  }
}

// PUT /api/cart - Update quantity of a cart item
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { _id, quantity } = await request.json();
    const updatedItem = await Cart.findByIdAndUpdate(_id, { quantity }, { new: true });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to update cart item: ${error.message}` }, { status: 500 });
  }
}

// DELETE /api/cart - Remove a cart item
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await Cart.findByIdAndDelete(id);

    return NextResponse.json({ message: "Item removed successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to delete cart item: ${error.message}` }, { status: 500 });
  }
}
