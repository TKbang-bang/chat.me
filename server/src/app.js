import express from "express";
import cors from "cors";
import router from "./router.js";

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

// router
app.use(router);

export default app;
