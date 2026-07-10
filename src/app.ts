import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import { connectCloudinary } from "./config/cloudinary";
import masterRouter from "./routes";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://cookbookguide.dpdns.org"],
    credentials: true,
  }),
);
app.use(express.json());

// Mount routes
app.use("/api/v1", masterRouter);

// Initialize external services
connectCloudinary();
connectDB();

export default app; // IMPORTANT: We export the app instead of listening
