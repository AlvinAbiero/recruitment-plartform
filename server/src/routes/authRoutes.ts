import express from "express";
import passport from "passport";
import * as authController from "../controllers/authController";
import {
  isAuthenticated,
  isEmailVerified,
  authorize,
} from "../middlewares/auth";
import { UserRole } from "../models/User";

const router = express.Router();

// Authentication routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/login",
  }),
  authController.googelCallback
);

// Protected routes
router.get("/me", isAuthenticated, authController.getMe);
router.patch(
  "/profile",
  isAuthenticated,
  isEmailVerified,
  authController.updateProfile
);

// Admin-only routes
router.patch(
  "/change-role/:userId",
  isAuthenticated,
  isEmailVerified,
  authorize(UserRole.ADMIN),
  authController.changeRole
);

export default router;
