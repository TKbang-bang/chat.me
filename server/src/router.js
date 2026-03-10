import { Router } from "express";
import authRoutes from "./routes/auth.routes.js";
import searchRoutes from "./routes/search.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/search", searchRoutes);

export default router;
