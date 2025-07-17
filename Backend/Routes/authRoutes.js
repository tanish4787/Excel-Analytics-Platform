import express from "express";
import { registerUser, loginUser } from "../Controllers/authController.js";
import { protectedRoute } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.get("/validate-token", protectedRoute, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
