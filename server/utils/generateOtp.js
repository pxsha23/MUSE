export const OTP_EXPIRY_MS = 10 * 60 * 1000;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;

export const generateOtp = () =>
  String(Math.floor(100000 + Math.random() * 900000));
