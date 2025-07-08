import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./Config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";

const startServer = async () => {
  try {
    await connectDB();

    const app = express();

    app.use(
      cors({
        origin: "https://excel-analytics-platform-mu.vercel.app",
        credentials: true,
      })
    );

    app.use(express.json());
    app.use(cookieParser()); 

    app.use("/api/auth", authRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/uploads", uploadRoutes);
    app.use("/admin", adminRoutes);

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
      });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server", error);
    process.exit(1);
  }
};

startServer();
