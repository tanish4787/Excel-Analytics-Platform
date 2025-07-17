import jwt from 'jsonwebtoken';
import User from '../Models/UserModel.js';

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(`[AuthMiddleware] Attempting to verify token for ${req.originalUrl}. Token found: ${!!token}`);

        if (!token) {
            console.log(`[AuthMiddleware] No token provided for ${req.originalUrl}.`);
            return res.status(401).json({ message: "No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`[AuthMiddleware] Token decoded for user ID: ${decoded._id} (for ${req.originalUrl})`);

        req.user = await User.findById(decoded._id).select('-password'); 
        if (!req.user) {
            console.log(`[AuthMiddleware] User not found for decoded ID: ${decoded._id} (for ${req.originalUrl}).`);
            return res.status(401).json({ message: "User associated with token not found." });
        }

        next();
    } catch (error) {
        console.error(`[AuthMiddleware] Authentication Error for ${req.originalUrl}:`, error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }
        return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
};