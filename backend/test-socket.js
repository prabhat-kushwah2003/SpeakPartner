import { io } from "socket.io-client";

// Paste a REAL access token from /auth/login
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTc3YThlZjc5ZGRhZDIxMGI1ZTUwMDciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Njk3MDkwMTMsImV4cCI6MTc2OTcwOTkxM30.MMq7vEg4Eb7hdnW7qvxmFO_KzcZZbnpYe5KbhIybzl4";

const socket = io(`${import.meta.env.VITE_API_URL}`, {
  auth: {
    token: ACCESS_TOKEN,
  },
  transports: ["websocket"], 
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});
