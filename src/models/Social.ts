import { Schema, Document, model, models } from "mongoose";

export interface ISocialMediaPost extends Document {
  platform: string;
  postLink: string;
  mediaType: "image" | "video" | "text";
  mediaUrl: string;
  description: string;
  tags: string[];
  datePosted: Date;
}

const SocialMediaPostSchema = new Schema<ISocialMediaPost>(
  {
    platform: { type: String, required: true },
    postLink: { type: String, required: true },
    mediaType: {
      type: String,
      required: true,
      enum: ["image", "video", "text"],
    },
    mediaUrl: { type: String },
    description: { type: String, required: true },
    tags: [{ type: String }],
    datePosted: { type: Date, required: true },
  },
  { timestamps: true }
);

export default models.SocialMediaPost ||
  model<ISocialMediaPost>("SocialMediaPost", SocialMediaPostSchema);
