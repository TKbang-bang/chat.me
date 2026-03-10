import { Router } from "express";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import sessionMiddleware from "./middlewares/session.js";

const router = Router();

router.use("/auth", authRoutes);

// protected
router.use("/protected", sessionMiddleware, protectedRoutes);

export default router;
