import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId; // Reference to User
  products: {
    product: mongoose.Types.ObjectId; // Reference to Product
    quantity: number;
    price: number; // Product price at the time of order
  }[];
  totalAmount: number;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>("Order", OrderSchema);
