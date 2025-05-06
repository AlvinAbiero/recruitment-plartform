import jwt, { SignOptions, Secret } from "jsonwebtoken";
import crypto from "crypto";
import { Token } from "../models/Token";
import config from "../config/config";
import { IUser } from "../models/User";

const JWT_SECRET = config.JWT_SECRET || ("" as Secret);
// Define a type for the expiresIn value
const JWT_EXPIRES_IN = config.JWT_EXPIRES_IN || "30d";

export const generateToken = (user: IUser): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const options: SignOptions = {
    // Use a direct cast to any to bypass type checking
    expiresIn: JWT_EXPIRES_IN as any,
  };

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    options
  );
};

// Generate verification token
export const generateVerificationToken = async (
  userId: string
): Promise<string> => {
  // Generate random token
  const token = crypto.randomBytes(32).toString("hex");

  // Save token to database
  await Token.create({
    userId,
    token,
    type: "verify",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  return token;
};

// Generate password reset token
export const generatePasswordResetToken = async (
  userId: string
): Promise<string> => {
  // Generate random token
  const token = crypto.randomBytes(32).toString("hex");

  // Save token to database
  await Token.create({
    userId,
    token,
    type: "reset",
    expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
  });

  return token;
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
