import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";
import crypto from "crypto";
import { sendEmail } from "../utils/email";

const CLIENT_URL = config.CLIENT_URL;

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
      verificationToken,
    });

    await newUser.save();

    const verificationLink = `${CLIENT_URL}/verify/${verificationToken}`;

    const emailOptions = {
      email,
      subject: "Welcome to Ajiri! Confirm Your Email Address",
      message: `
       <div style="background-color: #fafafa; padding: 20px; border-radius: 10px;">
    <h1 style="color: #633cff; margin-bottom: 20px;">Welcome aboard!</h1>
    <p style="color: #737373; margin-bottom: 15px;">Greetings from DevLinks! We're thrilled to have you join our community.</p>
    <p style="color: #737373; margin-bottom: 15px;">To complete your registration and unlock all the amazing features, please click the button below to verify your email address:</p>
    <p style="text-align: center; margin-bottom: 20px;"><a href="${verificationLink}" style="background-color: #633cff; color: #fafafa; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Verify Email Address</a></p>
    <p style="color: #737373; margin-bottom: 15px;">Alternatively, you can copy and paste the following link into your browser:</p>
    <p style="color: #737373; margin-bottom: 15px;"><em>${verificationLink}</em></p>
    <p style="color: #737373; font-weight: bold;">If you didn't sign up for  DevLinks, no worries! Simply ignore this email.</p>
  </div>
      `,
    };

    // send verification email
    await sendEmail(emailOptions);

    res.status(201).json({
      status: 'success',
      message: 'Verification email sent. Please verify email address.'
    })

    
  } catch (error) {}
};
