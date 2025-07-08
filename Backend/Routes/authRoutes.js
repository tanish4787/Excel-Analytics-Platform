import express from "express";
import { registerUser, loginUser } from "../Controllers/authController.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.get("/validate-token", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
