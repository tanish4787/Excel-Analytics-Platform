import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

export const protectedRoute = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  if (!token)
    return res.status(401).json({ message: 'Not authenticated.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password');
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.isAdmin) return next();
  return res.status(403).json({ message: 'Admin access only' });
};
