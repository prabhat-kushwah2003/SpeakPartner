import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/ids",
  filename: (req, file, cb) => {
    cb(
      null,
      `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const fileFilter = (req, file, cb) => {
  console.log("In upload middleware");
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
