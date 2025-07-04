import jwt from "jsonwebtoken";
import UserModel from "../Models/UserModel.js";

export const protectedRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UserModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user
        next();

    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}


export const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: 'User Not Found' })
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized, Access Denied' })
        }

        next()

    } catch (error) {
        console.error(error)
        return res.status(401).json({ message: 'Invalid or expired token' })

    }
}
