import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getMyCallHistory,
  saveCallHistory,
  uploadRecording as uploadRecordingController,
} from "../controllers/callHistory.controller.js";
import uploadRecording from "../middlewares/recording.middleware.js";

const router = express.Router();

router.post("/save", authMiddleware, saveCallHistory); // *

router.post(
  "/recording",
  authMiddleware,
  uploadRecording.single("recording"),
  uploadRecordingController,
);

router.get("/", authMiddleware, getMyCallHistory);

export default router;
