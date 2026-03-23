import { Router } from "express";
import {
  getAllUsersController,
  userBlockController,
  userUnBlockController,
} from "../controllers/users.controller.js";

const usersRoutes = Router();

usersRoutes.get("/", getAllUsersController);
usersRoutes.post("/:userId/block", userBlockController);
usersRoutes.post("/:userId/unblock", userUnBlockController);

export default usersRoutes;
