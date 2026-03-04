import { Router } from "express";
import {
  codeRefreshController,
  isAuthenticated,
  logoutController,
  signinController,
  signupController,
  verifyController,
} from "../controllers/auth.controller.js";
import { authValidation } from "../middlewares/authValidation.js";
import sessionMiddleware from "../middlewares/session.js";

const authRoutes = Router();

authRoutes.post("/signup", authValidation, signupController);
authRoutes.put("/resend", codeRefreshController);
authRoutes.post("/verify", verifyController);
authRoutes.get("/islogged", sessionMiddleware, isAuthenticated);
authRoutes.post("/signin", signinController);
authRoutes.delete("/logout", sessionMiddleware, logoutController);

export default authRoutes;
