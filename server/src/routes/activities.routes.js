import { Router } from "express";
import {
  cancelRequestController,
  sendRequestController,
} from "../controllers/activities.controller.js";

const activitiesRoutes = Router();

activitiesRoutes.post("/request", sendRequestController);
activitiesRoutes.post("/request/cancel", cancelRequestController);

export default activitiesRoutes;
