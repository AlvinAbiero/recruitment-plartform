import { Request, Response } from "express";
// import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
  } catch (error) {}
};
