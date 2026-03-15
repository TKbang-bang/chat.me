import { Router } from "express";
import {
  deleteGroupChatController,
  getChatInfoController,
  getChatMessagesController,
  getChatsController,
  leaveGroupChatController,
} from "../controllers/chats.controller.js";

const chatsRoutes = Router();

chatsRoutes.get("/", getChatsController);
chatsRoutes.get("/:chatId", getChatMessagesController);
chatsRoutes.get("/:chatId/info", getChatInfoController);
chatsRoutes.delete("/:chatId/leave", leaveGroupChatController);
chatsRoutes.delete("/:chatId/delete", deleteGroupChatController);

export default chatsRoutes;
