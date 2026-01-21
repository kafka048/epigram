import mongoose, { Model, ObjectId } from "mongoose";
import { Document, Schema, Mongoose } from "mongoose";

export interface User extends Document {
  // _id:
  username: string;
  email: string;
  hashedPassword?: string;
  verificationCode: number;
  verificationCodeExpiry: Date;
  isVerified: boolean;
}

const userSchema: Schema<User> = new Schema(
  {
    username: {
      type: Schema.Types.String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: [true, "Email is required."],
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    hashedPassword: {
      type: Schema.Types.String,
    },
    verificationCode: {
      type: Schema.Types.Number,
      required: [true, "A verification code is required"],
    },
    verificationCodeExpiry: {
      type: Schema.Types.Date,
      required: [true, "A verification code expiration time is required"],
    },
    isVerified: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export interface Message extends Document {
  // _id:
  recipientId: mongoose.Types.ObjectId;
  content: string
}

const messageSchema: Schema<Message> = new Schema(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({
  recipientId: 1,
  createdAt: -1,
});

export const UserModel =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

export const MessageModel =
  mongoose.models.Message || mongoose.model<Message>("Message", messageSchema);
