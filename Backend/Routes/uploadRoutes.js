import { Router } from 'express';
import {
    uploadExcel,
    viewUploads,
    getSingleUpload,
    downloadExcel,
    downloadJson,
    saveAnalysis,
    getAnalysisSessions
} from '../Controllers/uploadController.js'
import { protectedRoute } from '../Middlewares/authMiddleware.js';
import upload from '../Middlewares/upload.js'; 

const router = Router();


router.post('/upload', protectedRoute, upload.single('file'), uploadExcel);

router.get('/view', protectedRoute, viewUploads);

router.get('/view/:id', protectedRoute, getSingleUpload);

router.get('/download/excel/:id', protectedRoute, downloadExcel);
router.get('/download/json/:id', protectedRoute, downloadJson);

router.post('/analysis/:id', protectedRoute, saveAnalysis);

router.get('/analysis/:id', protectedRoute, getAnalysisSessions);

export default router;