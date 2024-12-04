import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/database/mongodb";
import Order from "@/models/Order";

// GET /api/orders - Fetch all orders for authenticated user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ user: userId }).populate("products.product");
    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to fetch orders: ${error.message}` }, { status: 500 });
  }
}

// POST /api/orders - Add a new order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { products, totalAmount, address } = await request.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "Products are required." }, { status: 400 });
    }

    for (const item of products) {
      if (!item.product || !item.quantity || !item.price) {
        return NextResponse.json(
          { error: "Each product must have a product ID, quantity, and price." },
          { status: 400 }
        );
      }
    }

    const newOrder = await Order.create({
      user: userId,
      products,
      totalAmount,
      address,
      status: "PENDING",
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to add order: ${error.message}` }, { status: 500 });
  }
}

// DELETE /api/orders/:id - Delete an order
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const deletedOrder = await Order.findOneAndDelete({ _id: orderId, user: userId });
    if (!deletedOrder) {
      return NextResponse.json({ error: "Order not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to delete order: ${error.message}` }, { status: 500 });
  }
}
