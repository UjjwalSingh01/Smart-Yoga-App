import { NextResponse } from "next/server";
import dbConnect from "@/database/mongodb";
import Order, { IOrder } from "@/models/Order";

interface SalesData {
  productsSold: {
    week: number;
    month: number;
    year: number;
  };
  sales: {
    week: number;
    month: number;
    year: number;
  };
  salesByMonth: { month: string; sales: number }[];
}

const getSalesData = async (): Promise<SalesData> => {
  const now = new Date();
  const startOfWeek = new Date();
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const productsSold = {
    week: 0,
    month: 0,
    year: 0,
  };

  const sales = {
    week: 0,
    month: 0,
    year: 0,
  };

  const salesByMonth: { month: string; sales: number }[] = [];

  await dbConnect();

  const orders: IOrder[] = await Order.find({ status: "DELIVERED" });

  for (const order of orders) {
    const createdAt = new Date(order.createdAt);
    const totalProducts = order.products.reduce((sum, p) => sum + p.quantity, 0);

    if (createdAt >= startOfWeek) {
      productsSold.week += totalProducts;
      sales.week += order.totalAmount;
    }
    if (createdAt >= startOfMonth) {
      productsSold.month += totalProducts;
      sales.month += order.totalAmount;
    }
    if (createdAt >= startOfYear) {
      productsSold.year += totalProducts;
      sales.year += order.totalAmount;
    }
  }

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleString("default", { month: "short" });
    const monthOrders = orders.filter(
      (o) =>
        new Date(o.createdAt).getFullYear() === date.getFullYear() &&
        new Date(o.createdAt).getMonth() === date.getMonth()
    );

    const totalSales = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    salesByMonth.push({
      month: monthName,
      sales: totalSales,
    });
  }

  return { productsSold, sales, salesByMonth };
};

export async function GET() {
  try {
    const data = await getSalesData();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
