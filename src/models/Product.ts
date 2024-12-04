import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  image: string;
  stocks: number;
  returnPolicy: string;
  shippingPolicy: string;
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  image: { type: String, required: true },
  stocks: { type: Number, required: true },
  returnPolicy: { type: String, required: true },
  shippingPolicy: { type: String, required: true },
});

export default models.Product || model<IProduct>("Product", ProductSchema);
