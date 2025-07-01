import express from 'express'
import { registerUser, loginUser } from '../Controllers/authController.js'
const router = express.Router()

router
    .post('/register', registerUser)
    .post('/login', loginUser )



export default router