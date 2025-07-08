import express from "express";
import { registerUser, loginUser } from "../Controllers/authController.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/validate-token", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;
