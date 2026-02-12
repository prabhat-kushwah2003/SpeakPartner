import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  getMyVerificationStatus,
  uploadVerification,
} from "../controllers/verification.controller.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  uploadVerification,
);

router.get("/status", authMiddleware, getMyVerificationStatus);

export default router;
