import express from "express";
import { protectedRoute } from "../Middlewares/authMiddleware.js";
import { getUserHistory } from "../Controllers/userController.js";

const router = express.Router();

router.get("/history", protectedRoute, getUserHistory);

export default router;
