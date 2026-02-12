import callHistory from "../models/callHistory.js";

// save call history
export const saveCallHistory = async (req, res) => {
  // console.log("Req: ", req);

  try {
    const { partnerId, sessionId, duration } = req.body;

    if (!partnerId || !sessionId || duration == undefined) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const history = await callHistory.create({
      userId: req.user.userId,
      partnerId,
      sessionId,
      duration,
      expiresAt,
    });

    return res.status(201).json(history);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// upload video recording
export const uploadRecording = async (req, res) => {
  try {
    const { callId } = req.body; // callId means _id from mongoDB
    const call = await callHistory.findById(callId);

    if (!callId) {
      return res.status(404).json({ message: "call not found" });
    }

    if (call.userId.toString() !== req.user.userId) {
      // req.user.userId is a string so its changed and it check only actual user can upload rec. not every on by gussing
      return res.status(403).json({ message: "Unauthorized" });
    }

    call.recordingPath = req.file.path;
    await call.save();

    return res.status(200).json({ message: "Video recording uploaded" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Get my call history
export const getMyCallHistory = async (req, res) => {
  try {
    const history = await callHistory
      .find({
        userId: req.user.userId,
      })
      .populate("partnerId", "username avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
