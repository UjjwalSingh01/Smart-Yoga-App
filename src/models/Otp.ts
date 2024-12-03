import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IOTP extends Document {
  adminId: mongoose.Types.ObjectId; // Reference to the Admin
  otp: string; // OTP code
  createdAt: Date;
  expiresAt: Date; // Expiry time for OTP
}

const OTPSchema = new Schema<IOTP>({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  otp: { type: String, required: true }, // 6-digit OTP code
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }, // 5-minute expiry
});

// Ensure expired OTPs are automatically deleted
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default models.OTP || model<IOTP>('OTP', OTPSchema);
