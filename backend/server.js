import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
// import { Socket } from "socket.io";
import initSocket from "./src/socket.js";
import http from "http";

dotenv.config();
connectDB();

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
