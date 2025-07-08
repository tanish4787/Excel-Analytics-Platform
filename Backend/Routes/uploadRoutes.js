import express from "express";
import upload from "../Middlewares/upload.js";
import {
  uploadExcel,
  viewUploads,
  getSingleUpload,
  downloadExcel,
  downloadJson,
  saveAnalysis,
  getAnalysisSessions,
} from "../Controllers/uploadController.js";
import { protectedRoute } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router
  .post("/", protectedRoute, upload.single("file"), uploadExcel)
  .get("/all", protectedRoute, viewUploads)
  .get("/download/json/:id", protectedRoute, downloadJson)
  .get("/download/excel/:id", protectedRoute, downloadExcel)
  .get("/:id", protectedRoute, getSingleUpload)
  .post("/analysis/:id", protectedRoute, saveAnalysis)
  .get("/analysis/:id", protectedRoute, getAnalysisSessions);

export default router;
