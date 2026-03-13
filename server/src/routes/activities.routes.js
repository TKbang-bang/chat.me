import { Router } from "express";
import {
  acceptRequestController,
  cancelRequestController,
  declineRequestController,
  getRequestsController,
  sendRequestController,
} from "../controllers/activities.controller.js";

const activitiesRoutes = Router();

activitiesRoutes.post("/requests", sendRequestController);
activitiesRoutes.post("/requests/cancel", cancelRequestController);
activitiesRoutes.post("/requests/accept", acceptRequestController);
activitiesRoutes.post("/requests/decline", declineRequestController);
activitiesRoutes.get("/requests", getRequestsController);

export default activitiesRoutes;
