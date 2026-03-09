import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import jwt from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import adminRouter from "./routes/adminroutes.js";
import blogRouter from "./routes/blogroutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// Database Connection
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
