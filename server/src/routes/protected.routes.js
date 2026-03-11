import { Router } from "express";
import searchRoutes from "./search.routes.js";
import groupsRoutes from "./group.routes.js";
import activitiesRoutes from "./activities.routes.js";

const protectedRoutes = Router();

protectedRoutes.use("/search", searchRoutes);
protectedRoutes.use("/groups", groupsRoutes);
protectedRoutes.use("/activities", activitiesRoutes);

export default protectedRoutes;
