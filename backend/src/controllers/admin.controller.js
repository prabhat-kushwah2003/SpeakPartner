import Verification from "../models/verification.js";

// get all pending verification
export const getPendingVerification = async (req, res) => {
  try {
    const pending = await Verification.find({ status: "pending" }).populate(
      "userId",
      "username email",
    );
    // console.log("", req);
    return res.status(200).json(pending);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// verified / rejected
export const reviewVerification = async (req, res) => {
  try {
    const { status } = req.body;
    const { userId } = req.params;
    // console.log("status", status);

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const verification = await Verification.findOne({ userId });

    if (!verification) {
      return res.status(404).json({
        message: "verification not found",
      });
    }

    verification.status = status;
    verification.reviewedBy = req.user.userId;
    verification.reviewedAt = new Date();

    await verification.save();

    return res.status(200).json({
      message: `user verification ${status}`,
    });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};
