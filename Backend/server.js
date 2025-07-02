import dotenv from 'dotenv'
dotenv.config()

import connectDB from './Config/db.js'
import express from 'express'
import authRoutes from './Routes/authRoutes.js'
import userRoutes from './Routes/userRoutes.js'
import adminRoutes from './Routes/adminRoutes.js'
import uploadRoutes from './Routes/uploadRoutes.js'

const startServer = async () => {

    try {

        const app = express()
        app.use(express.json())
        await connectDB()

        app.use('/api/auth', authRoutes)
        app.use('/api/user', userRoutes)
        app.use('/api/admin', adminRoutes)
        app.use('/api/upload', uploadRoutes)






        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on ${process.env.PORT || 5000}`);

        })

    } catch (error) {
        console.error(`Error Starting Server`, error);
        process.exit(1)
    }
}

startServer()