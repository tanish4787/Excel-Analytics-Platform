import express from "express";
import { protectedRoute, isAdmin } from "../Middlewares/auth.js";
import User from "../Models/UserModel.js";
import ExcelRecord from "../Models/ExcelRecord.js";

const router = express.Router();

router.get("/dashboard", protectedRoute, isAdmin, (req, res) => {
  res.status(200).json({
    message: "Welcome Admin 🚀",
    user: req.user,
  });
});

router.get("/users", protectedRoute, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    console.error("Admin - Get Users Error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.get("/uploads", protectedRoute, isAdmin, async (req, res) => {
  try {
    const uploads = await ExcelRecord.find().populate("user", "email");
    res.json({ uploads });
  } catch (err) {
    console.error("Admin - Get Uploads Error:", err);
    res.status(500).json({ message: "Failed to fetch uploads" });
  }
});

router.delete("/users/:id", protectedRoute, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await ExcelRecord.deleteMany({ user: userId });

    res.json({ message: "User and their uploads deleted successfully" });
  } catch (err) {
    console.error("Admin - Delete User Error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

router.delete("/uploads/:id", protectedRoute, isAdmin, async (req, res) => {
  try {
    const upload = await ExcelRecord.findByIdAndDelete(req.params.id);
    if (!upload) return res.status(404).json({ message: "Upload not found" });

    res.json({ message: "Upload deleted successfully" });
  } catch (err) {
    console.error("Admin - Delete Upload Error:", err);
    res.status(500).json({ message: "Failed to delete upload" });
  }
});

export default router;
