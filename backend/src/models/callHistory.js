import mongoose from "mongoose";

const callHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
    },
    recordingPath: {
      type: String,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

callHistorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("callHistory", callHistorySchema);

