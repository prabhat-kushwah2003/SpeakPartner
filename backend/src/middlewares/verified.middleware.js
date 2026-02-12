import Verification from "../models/verification.js";

const verifiedMiddleware = async (req, res, next) => {
  try {
    const verification = await Verification.findOne({
      userId: req.user.userId,
    });

    if (!verification || verification.status !== "verified") {
      return res.status(403).json({
        message: "User not verified",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export default verifiedMiddleware;
