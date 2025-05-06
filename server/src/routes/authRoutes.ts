import express from "express";
import passport from "passport";
import * as authController from "../controllers/authController";
import { Request, Response } from "express";
import {
  isAuthenticated,
  isEmailVerified,
  authorize,
} from "../middlewares/auth";
import { UserRole } from "../models/User";

const router = express.Router();
// Add this to your authRoutes.ts file
import { diagnoseJwtIssue, verifySpecificToken } from "../utils/jwt-diagnostic";

// Run JWT diagnostic on server startup
diagnoseJwtIssue();

// Add a diagnostic route
router.post("/token-diagnostic", (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({
      status: "fail",
      message: "Please provide a token to diagnose",
    });
    return;
  }

  const decodedToken = verifySpecificToken(token);

  if (decodedToken) {
    res.status(200).json({
      status: "success",
      message: "Token is valid",
      decodedToken,
    });
    return;
  } else {
    res.status(401).json({
      status: "fail",
      message: "Token verification failed. See server logs for details.",
    });
    return;
  }
});

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
