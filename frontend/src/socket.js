import { io } from "socket.io-client";

// Create socket with autoConnect: false so we control when to connect
const socket = io("http://localhost:5000", {
  autoConnect: false,
  transports: ["websocket"],
});
// const socket = io("https://zpr7gwss-5000.inc1.devtunnels.ms/", {
//   autoConnect: false,
//   transports: ["websocket"],
// });

// Call this after login with the fresh token
export const connectSocket = (token) => {
  socket.auth = { token };
  if (!socket.connected) {
    socket.connect();
  }
};

// Call this on logout
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
