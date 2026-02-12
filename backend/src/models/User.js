import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    avatar: {
      type: String,
      default:
        "data:image/png;base64,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",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshTokenHash: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
export default User;
