import { sendEmail } from "../utils/email";
import { IUser } from "../models/User";
import config from "../config/config";
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from "../utils/jwt";

export const sendVerificationEmail = async (user: IUser): Promise<void> => {
  // Generate verification token
  const verificationToken = await generateVerificationToken(
    user._id.toString()
  );

  const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  // Send email
  await sendEmail({
    to: user.email,
    subject: "Welcome to Ajiri! Confirm Your Email Address",
    html: `
       <div style="background-color: #fafafa; padding: 20px; border-radius: 10px;">
    <h1 style="color: #633cff; margin-bottom: 20px;">Welcome aboard!</h1>
    <p style="color: #737373; margin-bottom: 15px;">Greetings from Ajiri! We're thrilled to have you join our community.</p>
    <p style="color: #737373; margin-bottom: 15px;">To complete your registration and unlock all the amazing features, please click the button below to verify your email address:</p>
    <p style="text-align: center; margin-bottom: 20px;"><a href="${verificationUrl}" style="background-color: #633cff; color: #fafafa; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Verify Email Address</a></p>
    <p style="color: #737373; margin-bottom: 15px;">Alternatively, you can copy and paste the following link into your browser:</p>
    <p style="color: #737373; margin-bottom: 15px;"><em>${verificationUrl}</em></p>
    <p style="color: #737373; font-weight: bold;">If you didn't sign up for  DevLinks, no worries! Simply ignore this email.</p>
  </div>
        `,
  });
};

export const sendPasswordResetEmail = async (user: IUser): Promise<void> => {
  // Generate reset tokem
  const resetToken = await generatePasswordResetToken(user._id.toString());

  const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;

  // send email
  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html: `
       <div style="background-color: #fafafa; padding: 20px; border-radius: 10px;">
    <h1 style="color: #633cff; margin-bottom: 20px;">Hi ${user.firstName}</h1>
    <p style="color: #737373; margin-bottom: 15px;">You requested a password reset. Please click the link below to reset your password:</p>
    <p style="text-align: center; margin-bottom: 20px;"><a href="${resetUrl}" style="background-color: #633cff; color: #fafafa; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a></p>
    <p style="color: #737373; margin-bottom: 15px;">This link will expire in 24 hours.</p>
    <p style="color: #737373; font-weight: bold;">If you didn't request this, no worries! Simply ignore this email.</p>
  </div>
        `,
  });
};
