import dotenv from 'dotenv'
dotenv.config()

import connectDB from './Config/db.js'
import express from 'express'
import authRoutes from './Routes/authRoutes.js'
import userRoutes from './Routes/userRoutes.js'
import adminRoutes from './Routes/adminRoutes.js'

const startServer = async () => {

    try {

        const app = express()
        app.use(express.json())
        await connectDB()

        app.use('/api/auth', authRoutes)
        app.use('/api/user', userRoutes)
        app.use('/api/admin', adminRoutes)

        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on ${process.env.PORT || 5000}`);

        })

    } catch (error) {
        console.log(`Error Starting Server`);
        process.exit(1)
    }
}

startServer()