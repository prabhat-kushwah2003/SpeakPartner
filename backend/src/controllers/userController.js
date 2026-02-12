import User from "../models/User.js";
import mongoose from "mongoose";
import { onlineUsers } from "../socket.js";

export const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-passwordHash"); // **

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (req.file) {
      user.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    // *
    if (req.body.username) {
      user.username = req.body.username;
    }

    await user.save();

    // *
    res.json(user)
    // res.json({
    //   message: "avatar uploaded successfully",
    //   avatar: user.avatar,
    // });
    
  } catch (err) {
    res.status(500).json({
      message: "Upload failed",
    });
  }
};

// get my profile
export const getMyProfile = async (req, res) => {
  // console.log("In control", req.user.userId);

  try {
    // console.log("Inside", req.user.userId);
    const profile = await User.findById(req.user.userId).select(
      "-passwordHash",
    );
    // **
    // console.log("Profile In COntro", profile.email);
    if (!profile) {
      return res.status(404).json({ message: "profile not found" });
    }

    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// get all online users // *
export const getOnlineUsers = async (req, res) => {
  try {
    const ids = Array.from(onlineUsers.keys());

    // console.log("ONLINE IDS:", ids);

    // SAFE conversion
    const objectIds = ids
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    // console.log("OBJECT IDS:", objectIds);

    if (objectIds.length === 0) {
      return res.json([]);
    }

    const users = await User.find(
      { _id: { $in: objectIds } },
      "username avatar",
    );

    // console.log("USERS FOUND:", users);

    return res.json(users);
  } catch (err) {
    console.error("🔥 REAL ERROR:", err); // VERY IMPORTANT
    return res.status(500).json({ error: err.message });
  }
};



// update username
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.username) {
      user.username = req.body.username;
    }

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};
