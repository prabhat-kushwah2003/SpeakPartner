import express from "express";
import {
  login,
  refreshAccessToken,
  signup,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();

// signup
router.post("/signup", signup);

// login
router.post("/login", login);

// refresh access token
router.post("/refresh", refreshAccessToken);

// logged out
router.post("/logout", logout);

export default router;
