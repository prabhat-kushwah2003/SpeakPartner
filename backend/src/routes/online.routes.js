import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import verifiedMiddleware from "../middlewares/verified.middleware.js";

const router = express.Router();

router.post("/go-online", authMiddleware, verifiedMiddleware, (req, res) => {
  return res.status(200).json({
    message: "You are now online",
  });
});

export default router;
