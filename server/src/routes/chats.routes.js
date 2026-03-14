import { Router } from "express";
import {
  getChatMessagesController,
  getChatsController,
} from "../controllers/chats.controller.js";

const chatsRoutes = Router();

chatsRoutes.get("/", getChatsController);
chatsRoutes.get("/:chatId", getChatMessagesController);

export default chatsRoutes;
