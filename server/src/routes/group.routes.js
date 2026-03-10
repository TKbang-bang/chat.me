import { Router } from "express";
import { createGroupController } from "../controllers/groups.controller.js";

const groupsRoutes = Router();

groupsRoutes.post("/create", createGroupController);

export default groupsRoutes;
