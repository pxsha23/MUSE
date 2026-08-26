import nodemailer from 'nodemailer';

export const isEmailConfigured = () =>
  Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);

let transporter = null;
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
};

export const sendOtpEmail = async ({ to, name, otp }) => {
  if (!isEmailConfigured()) {
    console.warn(
      `[email not configured] OTP for ${to} is ${otp} (set GMAIL_USER/GMAIL_APP_PASSWORD in server/.env to send real emails)`
    );
    return { sent: false, devOtp: otp };
  }

  await getTransporter().sendMail({
    from: `MUSE <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Your MUSE verification code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background:#FFF7F9; border-radius: 16px;">
        <h1 style="color:#C13B6A; letter-spacing: 2px; font-size: 28px; margin-bottom: 8px;">MUSE</h1>
        <p style="color:#333; font-size: 15px;">Hi ${name || 'there'},</p>
        <p style="color:#333; font-size: 15px;">Your verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color:#C13B6A; margin: 16px 0;">${otp}</div>
        <p style="color:#777; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });

  return { sent: true };
};
