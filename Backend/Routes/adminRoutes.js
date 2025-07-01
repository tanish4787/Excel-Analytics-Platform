import express from 'express'
import { protectedRoute, isAdmin } from '../Middlewares/auth.js'

const router = express.Router()

router.get('/admin/dashboard', protectedRoute, isAdmin, (req, res) => {
  res.status(200).json({
    message: 'Welcome Admin 🚀',
    user: req.user,
  })
})

export default router
