import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/database/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart"
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ user: userId }).populate("products.product");
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch orders: ${error}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: User ID is missing." }, { status: 401 });
    }

    const cartItems = await request.json();
    console.log(cartItems)

    let totalAmount = 0;
    const orderProducts = cartItems.map((item: any) => {
      totalAmount += item.price * item.quantity;
      return {
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      };
    });

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    console.log(user);

    await Order.create({
      user: user._id,
      products: orderProducts,
      totalAmount,
      status: "PENDING",
      address: "RANDOM ADDRESS",
    });

    await Cart.deleteMany({ user: userId });

    for (const item of cartItems) {
      const product = await Product.findById(item._id);
      if (product) {
        product.quantity -= item.quantity;
        if (product.quantity < 0) product.quantity = 0; 
        await product.save();
      }
    }

    // return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error during checkout:", error);
    return NextResponse.json({ error: "Failed to complete checkout" }, { status: 500 });
  }
}


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
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete order: ${error}` }, { status: 500 });
  }
}
