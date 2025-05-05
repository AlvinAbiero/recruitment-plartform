import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { Token } from "../models/Token";
import { generateToken } from "../utils/jwt";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../services/emailService";
import { AppError } from "../middlewares/error";
import { AuthRequest } from "../middlewares/auth";
import config from "../config/config";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists", 400));
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || "candidate",
    });

    // send verification email
    await sendVerificationEmail(user);

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      status: "success",
      message:
        "Registration successful, verification email sent. Please verify email address.",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Invalid email or password", 401));
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      status: "success",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;

    // Find token in database
    const verificationToken = await Token.findOne({
      token,
      type: "verify",
    });

    if (!verificationToken) {
      return next(new AppError("Invalid or expired verification token", 400));
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      verificationToken.userId,
      { isEmailVerified: true },
      { new: true }
    );

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Delete the token
    await Token.findByIdAndDelete(verificationToken._id);

    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // send password reset email
    await sendPasswordResetEmail(user);

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find token in database
    const resetToken = await Token.findOne({
      token,
      type: "reset",
    });

    if (!resetToken) {
      return next(new AppError("Invalid or expired reset token", 400));
    }

    // Update user password
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    user.password = password;
    await user.save();

    // Delete the token
    await Token.findByIdAndDelete(resetToken._id);

    res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

export const googelCallback = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.redirect(
        `${config.FRONTEND_URL}/auth/google?error=Authentication failed`
      );
    }
    const token = generateToken(req.user);

    // You might want to set cookies instead of using query params for better security
    // Or redirect to a page that will store the token in localStorage/sessionStorage
    // Redirect to the frontend with the token
    res.redirect(`${config.FRONTEND_URL}/auth/google-callback?token=${token}`);
  } catch (error) {
    next(error);
  }
};

export const getMe = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    // Return only necessary user information (sanitize sensitive data)
    const userData = {
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      isEmailVerified: req.user.isEmailVerified,
      profilePicture: req.user.avatarUrl,
    };

    res.status(200).json({
      status: "success",
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, profileData } = req.body;

    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        profileData,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    next(error);
  }
};
