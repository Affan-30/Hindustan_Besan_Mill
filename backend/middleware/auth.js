import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import User from "../models/User.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("Not authorized. Please log in.", 401);
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new AppError("User no longer exists.", 401);
    req.user = user;
    next();
  } catch (err) {
    next(new AppError("Not authorized. Please log in.", 401));
  }
};

export const authorizeRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action.", 403));
    }
    next();
  };
