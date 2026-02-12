import mongoose from "mongoose";
import User from "./User.js";

const verificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    documentType: {
      type: String,
      enum: ["aadhaar", "passport", "student_id"],
      required: true,
    },

    documentPath: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Verification = mongoose.model("Verification", verificationSchema);
export default Verification;
