import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "you access a protected route",
    user: req.user,
  });
});

export default router;
