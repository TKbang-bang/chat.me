import { Router } from "express";
import {
  getChatInfoController,
  getChatMessagesController,
  getChatsController,
} from "../controllers/chats.controller.js";

const chatsRoutes = Router();

chatsRoutes.get("/", getChatsController);
chatsRoutes.get("/:chatId", getChatMessagesController);
chatsRoutes.get("/:chatId/info", getChatInfoController);

export default chatsRoutes;
