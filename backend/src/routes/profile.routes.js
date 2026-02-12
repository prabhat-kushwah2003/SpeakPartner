import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createProfile,
  getMyProfile,
  updateProfile,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createProfile);
router.get("/me", authMiddleware, getMyProfile);
router.put("/", authMiddleware, updateProfile);

export default router;
