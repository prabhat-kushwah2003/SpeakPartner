import express, { urlencoded } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import verificationRoutes from "./routes/verification.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import onlineRoutes from "./routes/online.routes.js";
import callHistoryRoutes from "./routes/callHistory.routes.js";
import userRoutes from "./routes/userRoutes.routes.js"


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for id uploads
app.use("/uploads", express.static("uploads"));



// auth routes
app.use("/auth", authRoutes);

app.use("/test", testRoutes);

app.use("/profile", profileRoutes);

app.use("/verification", verificationRoutes);

app.use("/admin", adminRoutes);

app.use("/online", onlineRoutes);

app.use("/calls", callHistoryRoutes);

app.use("/user", userRoutes)

app.get("/", (req, res) => {
  res.send("SpeakPartner API running");
});

export default app;
