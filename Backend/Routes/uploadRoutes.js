import express from 'express'
import upload from '../Middlewares/upload.js'
import { uploadExcel, viewUploads, getSingleUpload } from '../Controllers/uploadController.js'
import { protectedRoute } from '../Middlewares/auth.js'

const router = express.Router()

router
    .post('/', protectedRoute, upload.single('file'), uploadExcel)
    .get('/all', protectedRoute, viewUploads)
    .get('/:id', protectedRoute, getSingleUpload)



export default router