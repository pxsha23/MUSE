import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.js';
import Store from '../models/Store.js';
import Cart from '../models/Cart.js';
import { generateToken, clearTokenCookie } from '../utils/generateToken.js';
import {
  generateOtp,
  OTP_EXPIRY_MS,
  OTP_RESEND_COOLDOWN_MS,
  OTP_MAX_ATTEMPTS,
} from '../utils/generateOtp.js';
import { sendOtpEmail } from '../utils/sendEmail.js';
import { slugify, uniqueSlugSuffix } from '../utils/slugify.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  emailVerified: user.emailVerified,
  avatarUrl: user.avatarUrl,
});

const issueOtp = async (user) => {
  const otp = generateOtp();
  user.otpCode = otp;
  user.otpExpires = new Date(Date.now() + OTP_EXPIRY_MS);
  user.otpAttempts = 0;
  user.otpLastSentAt = new Date();
  await user.save();
  try {
    return await sendOtpEmail({ to: user.email, name: user.name, otp });
  } catch (err) {
    console.error('Failed to send OTP email, falling back to dev mode:', err.message);
    return { sent: false, devOtp: otp };
  }
};

const createUniqueStoreSlug = async (storeName) => {
  const base = slugify(storeName) || 'store';
  let slug = base;
  // eslint-disable-next-line no-await-in-loop
  while (await Store.exists({ slug })) {
    slug = `${base}-${uniqueSlugSuffix()}`;
  }
  return slug;
};

// @route POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, storeName } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('name, email, password and role are required');
  }
  if (!['buyer', 'seller'].includes(role)) {
    res.status(400);
    throw new Error('role must be buyer or seller');
  }
  if (password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters');
  }
  if (role === 'seller' && !storeName) {
    res.status(400);
    throw new Error('storeName is required for sellers');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password,
    role,
    phone,
  });

  if (role === 'seller') {
    const slug = await createUniqueStoreSlug(storeName);
    await Store.create({ owner: user._id, storeName, slug });
  }

  await Cart.create({ user: user._id, items: [] });

  const otpResult = await issueOtp(user);
  generateToken(res, user);

  res.status(201).json({
    user: publicUser(user),
    devOtp: otpResult.sent ? undefined : otpResult.devOtp,
  });
});

// @route POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  generateToken(res, user);
  res.json({ user: publicUser(user) });
});

// @route POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  res.json({ message: 'Logged out' });
});

// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// @route POST /api/auth/verify-otp
export const verifyOtp = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) {
    res.status(400);
    throw new Error('code is required');
  }

  const user = await User.findById(req.user._id).select(
    '+otpCode +otpExpires +otpAttempts +otpLastSentAt'
  );

  if (user.emailVerified) {
    return res.json({ message: 'Already verified', user: publicUser(user) });
  }

  if (!user.otpCode || !user.otpExpires || user.otpExpires < new Date()) {
    res.status(400);
    throw new Error('Code expired. Please request a new one.');
  }

  if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
    res.status(400);
    throw new Error('Too many incorrect attempts. Please request a new code.');
  }

  if (user.otpCode !== code) {
    user.otpAttempts += 1;
    await user.save();
    res.status(400);
    throw new Error('Incorrect code');
  }

  user.emailVerified = true;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  user.otpAttempts = 0;
  await user.save();

  res.json({ message: 'Email verified', user: publicUser(user) });
});

// @route POST /api/auth/resend-otp
export const resendOtp = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+otpLastSentAt');

  if (user.emailVerified) {
    res.status(400);
    throw new Error('Email is already verified');
  }

  if (user.otpLastSentAt && Date.now() - user.otpLastSentAt.getTime() < OTP_RESEND_COOLDOWN_MS) {
    const waitMs = OTP_RESEND_COOLDOWN_MS - (Date.now() - user.otpLastSentAt.getTime());
    res.status(429);
    throw new Error(`Please wait ${Math.ceil(waitMs / 1000)}s before requesting another code`);
  }

  const otpResult = await issueOtp(user);
  res.json({
    message: 'Verification code sent',
    devOtp: otpResult.sent ? undefined : otpResult.devOtp,
  });
});
