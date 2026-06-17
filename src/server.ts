import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import { connectCloudinary } from "./config/cloudinary";
import masterRouter from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use("/api/v1", masterRouter);
connectCloudinary();
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Master API circuit is running in ${process.env.NODE_ENV} mode on ${PORT}`,
    );
  });
});
