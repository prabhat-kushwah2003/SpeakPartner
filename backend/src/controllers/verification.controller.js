import Verification from "../models/verification.js";

export const uploadVerification = async (req, res) => {
        // console.log("req.body:",req.body);
        // console.log("req.file:",req.file);
  try {
    const { documentType } = req.body;

    if (!req.file || !documentType) {
      return res.status(400).json({
        message: "Document and type required",
      });
    }

    const existing = await Verification.findOne({
      userId: req.user.userId,
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Verification already submitted" });
    }

    const verification = await Verification.create({
      userId: req.user.userId,
      documentType,
      documentPath: req.file.path,
    });

    return res.status(201).json({
      message: "verification submitted",
      status: verification.status,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// get my verification status
export const getMyVerificationStatus = async (req, res) => {
  try {
    const verification = await Verification.findOne({
      userId: req.user.userId,
    });

    if (!verification) {
      return res.status(404).json({
        message: "No verification found",
      });
    }

    return res.status(200).json({
      status: verification.status,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
