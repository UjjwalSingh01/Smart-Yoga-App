import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface ICartItem extends Document {
  user: mongoose.Types.ObjectId; // Reference to User
  product: mongoose.Types.ObjectId; // Reference to Product
  quantity: number;
  createdAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

export default models.Cart || model<ICartItem>('Cart', CartItemSchema);
