import passport from "passport";
// import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import {
  Strategy as GoogleStrategy,
  ExtractJwt,
} from "passport-google-oauth20";
import { User, IUser } from "../models/User";
import config from "./config";
// import express, { Request, Response } from "express";
// import jwt from "jsonwebtoken";
import { UserRole } from "../models/User";

// declare module "express" {
//   export interface Request {
//     user?: any;
//   }
// }

// google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.OAUTH_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails![0].value });
        if (user) {
          // if user exists but signed up with email/password
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }

          return done(null, user);
        }

        //  create new User
        user = await User.create({
          email: profile.emails![0].value,
          firstName: profile.name?.giverName || "",
          lastName: profile.name?.familName || "",
          googleId: profile.id,
          profilePicture: profile.photos![0].value,
          isEmailVerified: true, //Google accounts already have verified email accounts
          role: UserRole, // default role
        });

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

// Persists user data inside session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Fetches session details using session id
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
