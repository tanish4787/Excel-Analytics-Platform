import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "User Not Found" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized, Access Denied" });
  }

  next();
};
