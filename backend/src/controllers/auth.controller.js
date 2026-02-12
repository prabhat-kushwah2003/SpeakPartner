import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// generate jwt access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, Email and Password are required",
      });
    }

    // check username uniqueness
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        message: "Username already taken",
      });
    }

    // check existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // create new user
    const user = await User.create({
      username,
      email,
      passwordHash,
    });

    const accessToken = generateAccessToken(user);

    // send response
    return res.status(201).json({
      message: "User registered successfully",
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "server error",
    });
  }
};

// Login 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email or  password are required",
      });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid creadentials",
      });
    }

    // blocked user check
    if (user.isBlocked) {
      return res.status(403).json({
        message: "Account is blocked",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // hash and store refresh token
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    user.refreshTokenHash = refreshTokenHash;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // check presence
    if (!refreshToken) {
      return res.status(401).json({
        message: "refresh token required",
      });
    }

    // verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // find user
    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({
        message: "invalid refresh token",
      });
    }

    // compare token with stored hash
    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    // issue new access token
    const newAccessToken = generateAccessToken(user);

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Refresh token expired or invalid",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // If no refresh token, stile response ok
    if (!refreshToken) {
      return res.status(200).json({
        message: "Logged out",
      });
    }

    // decode refresh token to get userId
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // find user
    const user = await User.findById(decoded.userId);
    if (user) {
      // remove stored refresh token
      user.refreshTokenHash = null;
      await user.save();
    }

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    // even if token is invalid, logged out successed
    return res.status(200).json({
      message: "Logged out",
    });
  }
};
