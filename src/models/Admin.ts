import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IAdmin extends Document {
  fullname: string;
  email: string;
  password: string;
  role: string; // e.g., "superadmin", "editor"
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store a hashed password
  role: { type: String, required: true, default: 'editor' },
  createdAt: { type: Date, default: Date.now },
});

export default models.Admin || model<IAdmin>('Admin', AdminSchema);