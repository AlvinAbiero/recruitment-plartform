import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {User, IUser} from "../models/User";
import config from "../config/config";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

declare module "express" {
  export interface Request {
    user?: any;
  }
}


// google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.OAUTH_CALLBACK_URL,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({email: profile.emails![0].value});
       if (user) {
        // if user exists but signed up with email/password
        if(!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user)
       }

      //  create new User
      user = await User.create({
        email: profile.emails![0].value,
        firstName: profile.name?.giverName || '',
        lastName: profile.name?.familName || '',
        googleId: profile.id,
        profilePicture: profile.photos![0].value,
        isEmailVerified: true, //Google accounts already have verified email accounts
        role: 'candidate' // default role
      })

       return done(null, user)
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);


// jwt strategy

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Bearer header
  secretOrKey: config.JWT_SECRET!, // Secret key for verification
};

passport.use(
  new JWTStrategy(opts, async (payload, done) => {
    try {
      const user = await User.findById({ id: payload.id });
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// export const googleAuth = passport.authenticate("google", {
//   scope: ["profile", "email"],
// });

// export const googleAuthCallBack = passport.authenticate("google", {
//   failureRedirect: "/auth/login",
//   session: false,
// });

// export const googleAuthSuccess = (req: Request, res: Response) => {
//   if (!req.user) {
//     res.status(401).json({ message: "Authentication failed" });
//   }

//   const JWT_SECRET = config.JWT_SECRET as string;
//   const CLIENT_URL = config.CLIENT_URL;

//   const token = jwt.sign(
//     { userId: req.user.id, role: req.user.role },
//     JWT_SECRET,
//     { expiresIn: "7d" }
//   );

//   res.redirect(`${CLIENT_URL}/dashboard?token=${token}`);
// };

// Persists user data inside session
passport.serializeUser((user: IUser, done) => {
  done(null, user.id);
});

// Fetches session details using session id
passport.deserializeUser((id: string, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

export default passport;
