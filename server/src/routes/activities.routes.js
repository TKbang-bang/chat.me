import { Router } from "express";
import {
  cancelRequestController,
  getRequestsController,
  sendRequestController,
} from "../controllers/activities.controller.js";

const activitiesRoutes = Router();

activitiesRoutes.post("/requests", sendRequestController);
activitiesRoutes.post("/requests/cancel", cancelRequestController);
activitiesRoutes.get("/requests", getRequestsController);

export default activitiesRoutes;
