import jwt from "jsonwebtoken";
import { getUserById } from "../../repositories/users.repository.js";

export const ioAuth = async (socket, next) => {
  // getting token from socket
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Token was not found in socket"));

  try {
    // verifying token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { userId } = decoded;

    // getting user by token user id
    const user = await getUserById(userId);
    if (!user) return next(new Error("User not found"));

    socket.userId = userId;
    return next();
  } catch (error) {
    return next(new Error("Authentication error"));
  }
};

export const setUserOnline = (socket, onlineUsers) => {
  if (!socket.userId) return socket.disconnect(true);

  const userSockets = onlineUsers.get(socket.userId) || new Set();
  userSockets.add(socket.id);
  onlineUsers.set(socket.userId, userSockets);
};

export const setUserOffline = (socket, onlineUsers) => {
  socket.on("disconnect", () => {
    const sockets = onlineUsers.get(socket.userId);
    if (!sockets) return;

    sockets.delete(socket.id);

    if (sockets.size === 0) {
      onlineUsers.delete(socket.userId);
    }

    console.log("Socket disconnected:", socket.id);
  });
};
