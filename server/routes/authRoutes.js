import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  logout,
  getMe,
  verifyOtp,
  resendOtp,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later' },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/verify-otp', protect, authLimiter, verifyOtp);
router.post('/resend-otp', protect, authLimiter, resendOtp);

export default router;
