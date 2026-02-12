import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// import { useId } from "react";

// *
export const onlineUsers = new Map(); // select all online users

// user with different lang. wait here
// english -> id1 id2
const waitingQueue = new Set();

// user which are just connected
const recentMatches = new Map();

// userA userB
const activeSessions = new Map();

// bi-directional communication between frontend and backend
const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = {
        userId: decoded.userId,
        role: decoded.role,
      };
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.userId;

    // Mark user online
    onlineUsers.set(userId, socket.id);
    console.log("user online:", userId);

    //  FIX: emit online users list (needed if frontend shows online users)
    io.emit("online-users", Array.from(onlineUsers.keys()));

    // find match
    socket.on("find-match", () => {
      // try to find a suitable partener
      for (const otherUserId of waitingQueue) {
        // skip self
        if (otherUserId === userId) continue;

        // skip recently matched users
        const recent = recentMatches.get(userId);
        if (recent && recent.has(otherUserId)) continue;

        // match found
        waitingQueue.delete(otherUserId);

        // init recent match sets
        if (!recentMatches.has(userId)) {
          recentMatches.set(userId, new Set());
        }

        if (!recentMatches.has(otherUserId)) {
          recentMatches.set(otherUserId, new Set());
        }

        // save recent match
        recentMatches.get(userId).add(otherUserId);
        recentMatches.get(otherUserId).add(userId);

        const sessionId = crypto.randomUUID();

        // FIX: store active session (CRITICAL for WebRTC)
        activeSessions.set(sessionId, {
          userA: userId,
          userB: otherUserId,
        });

        // notify both users
        socket.emit("match-found", {
          sessionId,
          partnerId: otherUserId,
        });

        io.to(onlineUsers.get(otherUserId)).emit("match-found", {
          sessionId,
          partnerId: userId,
        });
        return;
      }
      // no match
      waitingQueue.add(userId);
      socket.emit("waiting");
    });

    // webrtc signaling -> for audio/ video

    // offer from caller
    socket.on("call-offer", ({ sessionId, offer, to }) => {
      const session = activeSessions.get(sessionId);

      if (!session) return;

      if (![session.userA, session.userB].includes(userId)) return;

      io.to(onlineUsers.get(to)).emit("call-offer", {
        sessionId,
        offer,
        from: userId,
      });
    });

    // answer from receiver
    socket.on("call-answer", ({ sessionId, answer, to }) => {
      const session = activeSessions.get(sessionId);
      if (!session) return;

      if (![session.userA, session.userB].includes(userId)) return;
      io.to(onlineUsers.get(to)).emit("call-answer", {
        sessionId,
        answer,
        from: userId,
      });
    });

    // ICE candidates exchange
    socket.on("ice-candidate", ({ sessionId, candidate, to }) => {
      const session = activeSessions.get(sessionId);
      if (!session) return;

      if (![session.userA, session.userB].includes(userId)) return;
      io.to(onlineUsers.get(to)).emit("ice-candidate", {
        candidate,
        from: userId,
      });
    });

    // end call
    socket.on("call-end", ({ sessionId, to }) => {
      activeSessions.delete(sessionId);
      io.to(onlineUsers.get(to)).emit("end-call");
    });

    // disconnect
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      waitingQueue.delete(userId);

      //  FIX: update online users list on disconnect
      io.emit("online-users", Array.from(onlineUsers.keys()));

      for (const [sessionId, session] of activeSessions.entries()) {
        if (session.userA === userId || session.userB === userId) {
          activeSessions.delete(sessionId);
        }
      }

      console.log("User offline:", userId);
    });
  });

  return { io, onlineUsers };
};

export default initSocket;
