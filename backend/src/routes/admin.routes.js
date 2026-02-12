import express from "express";
import adminMiddleware from "../middlewares/admin.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getPendingVerification,
  reviewVerification,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get(
  "/verification",
  authMiddleware,
  adminMiddleware,
  getPendingVerification,
);

router.post(
  "/verify/:userId",
  authMiddleware,
  adminMiddleware,
  reviewVerification,
);

export default router;
