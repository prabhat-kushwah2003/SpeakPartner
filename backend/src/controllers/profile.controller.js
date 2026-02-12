import Profile from "../models/profile.js";
import User from "../models/User.js";

// Create Profile
export const createProfile = async (req, res) => {
  try {
    const { country, skillLevel } = req.body;

    const existingProfile = await Profile.findOne({ userId: req.user.userId });

    if (existingProfile) {
      return res.status(409).json({ message: "Profile already exists" });
    }

    // fetch user to get username
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found    ",
      });
    }

    const profile = await Profile.create({
      userId: req.user.userId,
      username: req.user.username || "user",
      country,
      skillLevel,
    });

    return res.status(201).json(profile);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Get my profile
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.userId });

    if (!profile) {
      return res.status(404).json({ message: "profile not found" });
    }
    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// update profile
export const updateProfile = async (req, res) => {
  try {
    const { country, skillLevel } = req.body;

    const profile = await Profile.findOne({ userId: req.user.userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (country !== undefined) profile.country = country;
    if (skillLevel !== undefined) profile.skillLevel = skillLevel;

    await profile.save();

    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};
