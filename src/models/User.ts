import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  orders: mongoose.Types.ObjectId[];
  cart: mongoose.Types.ObjectId[];
  blogs: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Password excluded by default
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartItem" }],
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
});

export default models.User || model<IUser>("User", UserSchema);
