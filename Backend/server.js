import dotenv from 'dotenv'
dotenv.config()

import connectDB from './Config/db.js'
import express from 'express'

const startServer = async () => {
    
    try {

        const app = express()
        app.use(express.json())

        await connectDB()
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on ${process.env.PORT || 5000}`);

        })

    } catch (error) {
        console.log(`Error Starting Server`);
        process.exit(1)
    }
}

startServer()