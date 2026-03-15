import {
  createMessageService,
  getUsersInChatService,
} from "./services/messages.service.js";

export const ioController = (socket, io, onlineUsers) => {
  socket.on("client_message", async (data) => {
    try {
      const message = await createMessageService(data, socket.userId);

      const usersInchat = await getUsersInChatService(data.chat.id);

      // enviar al emisor
      socket.emit("server_message", message);

      for (const user of usersInchat) {
        if (user.id === socket.userId) continue;

        const sockets = onlineUsers.get(user.id);
        if (!sockets) continue;

        for (const socketId of sockets) {
          io.to(socketId).emit("server_message", { ...message, me: false });
        }
      }
    } catch (error) {
      return socket.emit("server_error", error.message);
    }
  });
};
