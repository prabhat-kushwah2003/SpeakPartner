import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/avatars",

  filename: (req, file, cb) => {
    cb(
      null,
      req.user.userId + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"]; //*

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

const uploadAvatar = multer({
  storage,
  fileFilter,
});

export default uploadAvatar;
