import { Router } from "express";
import {
  codeRefreshController,
  signinController,
  signupController,
  verifyController,
} from "../controllers/auth.controller.js";
import { authValidation } from "../middlewares/authValidation.js";

const authRoutes = Router();

authRoutes.post("/signup", authValidation, signupController);
authRoutes.post("/verify", verifyController);
authRoutes.put("/code_refresh", codeRefreshController);
authRoutes.post("/signin", signinController);

export default authRoutes;
