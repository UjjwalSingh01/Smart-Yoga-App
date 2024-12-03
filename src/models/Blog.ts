import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  image: string;
  creator: mongoose.Types.ObjectId; // Reference to Admin or User
  creatorRole: 'admin' | 'user'; // Distinguish between admin and user
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to the creator (Admin or User)
    creatorRole: { type: String, required: true, enum: ['admin', 'user'] }, // Role of the creator
    tags: { type: [String], default: [] },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default models.Blog || model<IBlog>('Blog', BlogSchema);
