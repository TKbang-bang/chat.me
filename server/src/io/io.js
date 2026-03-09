import { Server } from "socket.io";
import {
  ioAuth,
  setUserOffline,
  setUserOnline,
} from "./services/io.auth.service.js";

const ioConnection = (server) => {
  // io
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  // auth
  io.use(ioAuth);

  // online users list
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    // set online user
    setUserOnline(socket, onlineUsers);

    console.log("Socket connected:", { id: socket.id, userId: socket.userId });

    // disconnect
    setUserOffline(socket, onlineUsers);
  });
};

export default ioConnection;
