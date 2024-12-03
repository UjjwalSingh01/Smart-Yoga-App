import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  discount: number; // Discount percentage
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  discount: { type: Number, default: 0 }, // Default 0% discount
  createdAt: { type: Date, default: Date.now },
});

export default models.Product || model<IProduct>('Product', ProductSchema);
