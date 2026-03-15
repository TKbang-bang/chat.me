import { Router } from "express";
import {
  userBlockController,
  userUnBlockController,
} from "../controllers/users.controller.js";

const usersRoutes = Router();

usersRoutes.post("/:userId/block", userBlockController);
usersRoutes.post("/:userId/unblock", userUnBlockController);

export default usersRoutes;
