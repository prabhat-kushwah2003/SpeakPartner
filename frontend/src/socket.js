import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("accessToken"), // jwt from login
  },
  transports: ["websocket"],
});

export default socket;
