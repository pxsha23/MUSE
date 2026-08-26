import jwt from 'jsonwebtoken';

const COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export const generateToken = (res, { id, role }) => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE_MS,
  });

  return token;
};

export const clearTokenCookie = (res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
};
