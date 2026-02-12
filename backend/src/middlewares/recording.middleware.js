import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/recordings",
  filename: (req, file, cb) => {
    cb(
      null,
      `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const fileFilter = (req, file, cb) => {
        const allowedTypes = ["video/webm"];
        if(allowedTypes.includes(file.mimetype)) {
                cb(null, true)
        } else{
                cb(new Error("Only video recordings allowed"), false)
        }
}

const uploadRecording = multer({storage, fileFilter})

export default uploadRecording