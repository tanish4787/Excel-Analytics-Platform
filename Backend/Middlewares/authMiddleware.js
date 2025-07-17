import jwt from 'jsonwebtoken';
import User from '../Models/UserModel.js';

export const protectedRoute = async (req, res, next) => {
    try {
        let token;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1]; 
        }

        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: "No token provided. Please log in." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded._id).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: "User associated with token not found." });
        }

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }
        return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
};