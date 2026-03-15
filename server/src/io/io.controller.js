import {
  createMessageService,
  getUsersInChatService,
  userKickOutService,
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

  socket.on("kick-out", async (data) => {
    try {
      await userKickOutService(data.chatId, data.userId, socket.userId);

      socket.emit("server_kick-out", { success: true });

      const sockets = onlineUsers.get(data.userId);
      if (!sockets) return;

      for (const socketId of sockets) {
        io.to(socketId).emit("server_kick-out", { success: true, you: true });
      }
    } catch (error) {
      return socket.emit("server_error", error.message);
    }
  });
};
