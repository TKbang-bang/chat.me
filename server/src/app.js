import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router.js";
import errorHandler from "./error/errorHandler.js";

// creating express app
const app = express();

// middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: ["access-token"],
  }),
);
app.use(express.json());
app.use(cookieParser());

// router
app.use(router);

// error
app.use(errorHandler);

export default app;
