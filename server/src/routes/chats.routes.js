import { Router } from "express";
import {
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

export default chatsRoutes;
