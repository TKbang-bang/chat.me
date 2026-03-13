import { Router } from "express";
import { getChatsController } from "../controllers/chats.controller.js";

const chatsRoutes = Router();

chatsRoutes.get("/", getChatsController);

export default chatsRoutes;
