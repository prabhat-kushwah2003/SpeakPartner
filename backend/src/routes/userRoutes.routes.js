import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import uploadAvatar from "../middlewares/uploadAvatar.middleware.js";
import {
  getMyProfile,
  getOnlineUsers,
  uploadAvatar as uploadAvatarController,
  updateProfile
} from "../controllers/userController.js";

const router = express.Router();

router.post(
  "/avatar",
  authMiddleware,
  uploadAvatar.single("avatar"),
  uploadAvatarController,
);

router.put("/profile", authMiddleware, updateProfile); // *


router.get("/profile", authMiddleware, getMyProfile);

// *
router.get("/online-users", authMiddleware, getOnlineUsers);

export default router;
