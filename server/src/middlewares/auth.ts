import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { UserRole, IUser } from "../models/User";
import { AppError } from "../middlewares/error";

export interface AuthRequest extends Request {
  user?: any;
}

export const isAuthenticated = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: IUser | false) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(new AppError("Not authorized, please login", 401));
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};

export const isEmailVerified = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user?.isEmailVerified) {
    return next(new AppError("Please verify your email address first", 403));
  }
  next();
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not authorized", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Not authorized to access this resource", 403));
    }

    next();
  };
};
