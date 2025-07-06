import dotenv from "dotenv";
dotenv.config();
import cors from 'cors'

import connectDB from "./Config/db.js";
import express from "express";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";

const startServer = async () => {
  try {
    const app = express();
    app.use(express.json());
    await connectDB();

    app.use(
      cors({
        origin: process.env.FRONTEND_URI,
        credentials: true,
      })
    );

    app.use("/api/auth", authRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/uploads", uploadRoutes);
    app.use("/admin",adminRoutes)
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
      });
    });

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on ${process.env.PORT || 5000}`);
    });
  } catch (error) {
    console.error(`Error Starting Server`, error);
    process.exit(1);
  }
};

startServer();
