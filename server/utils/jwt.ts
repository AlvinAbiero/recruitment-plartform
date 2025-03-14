import jwt from "jsonwebtoken";
import { UserRole } from "../models/User";
import config from "../config/config";

interface TokenPayload {
  id: string;
  role: UserRole;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = config.JWT_SECRET;
  const expiresIn = config.JWT_EXPIRE;

  if (!secret) {
    throw new Error("JWT secret is not defined"); // Handle the error appropriately
  }
  return jwt.sign(payload, secret as string, { expiresIn });
};
