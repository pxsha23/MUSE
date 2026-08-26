import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, invalid token');
  }
});

export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`This action requires role: ${roles.join(' or ')}`);
    }
    next();
  };

export const requireVerified = (req, res, next) => {
  if (!req.user?.emailVerified) {
    res.status(403);
    const err = new Error('Please verify your email to continue.');
    err.code2 = 'EMAIL_NOT_VERIFIED';
    throw err;
  }
  next();
};
