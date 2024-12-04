import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/database/mongodb";
import Order from "@/models/Order";

// GET /api/orders - Fetch all orders for authenticated user
export async function GET(request: NextRequest) {
    try {
      await dbConnect();
  
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const orders = await Order.find({ user: session.user.id }).populate("products.product");
      return NextResponse.json(orders, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: `Failed to fetch orders: ${error.message}` }, { status: 500 });
    }
}

// POST /api/orders - Place a new order
export async function POST(request: NextRequest) {
    try {
      await dbConnect();
  
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { products, totalAmount, address } = await request.json();
      const newOrder = await Order.create({
        user: session.user.id,
        products,
        totalAmount,
        address,
        status: "PENDING",
      });
  
      return NextResponse.json(newOrder, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: `Failed to place order: ${error.message}` }, { status: 500 });
    }
}

// DELETE /api/orders/:id - Delete an order
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const deletedOrder = await Order.findOneAndDelete({ _id: orderId, user: session.user.id });

    if (!deletedOrder) {
      return NextResponse.json({ error: "Order not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to delete order: ${error.message}` }, { status: 500 });
  }
}