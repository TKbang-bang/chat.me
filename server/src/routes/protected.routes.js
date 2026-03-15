import { Router } from "express";
import searchRoutes from "./search.routes.js";
import groupsRoutes from "./group.routes.js";
import activitiesRoutes from "./activities.routes.js";
import chatsRoutes from "./chats.routes.js";
import usersRoutes from "./users.routes.js";

const protectedRoutes = Router();

protectedRoutes.use("/search", searchRoutes);
protectedRoutes.use("/groups", groupsRoutes);
protectedRoutes.use("/activities", activitiesRoutes);
protectedRoutes.use("/chats", chatsRoutes);
protectedRoutes.use("/users", usersRoutes);

export default protectedRoutes;
