import { Router } from "express";
import {
  codeRefreshController,
  signinController,
  signupController,
  verifyController,
} from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/signup", signupController);
authRoutes.post("/verify", verifyController);
authRoutes.put("/code_refresh", codeRefreshController);
authRoutes.post("/signin", signinController);

export default authRoutes;
