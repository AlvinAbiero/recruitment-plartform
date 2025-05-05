import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
// import {
//   Strategy as GoogleStrategy,
//   VerifyCallback,
// } from "passport-google-oauth20";
import { User } from "../models/User";
import config from "../config/config";

// Define JWT Strategy options
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
};

// Register JWT Strategy
passport.use(
  new JwtStrategy(jwtOptions, async (payload: any, done: any) => {
    try {
      // Find the user by ID from JWT payload
      const user = await User.findById(payload.id);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Register Google OAuth Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: config.GOOGLE_CLIENT_ID,
//       clientSecret: config.GOOGLE_CLIENT_SECRET,
//       callbackURL: `${config.API_URL}/auth/google/callback`,
//       scope: ["profile", "email"],
//     },
//     async (
//       _accessToken: string,
//       _refreshToken: string,
//       profile: any,
//       done: VerifyCallback
//     ) => {
//       try {
//         // Check if user already exists
//         let user = await User.findOne({ email: profile.emails?.[0].value });

//         if (user) {
//           // If user exists but was created through email/password (not Google)
//           if (!user.googleId) {
//             user.googleId = profile.id;
//             await user.save();
//           }
//         } else {
//           // Create new user from Google profile
//           user = await User.create({
//             email: profile.emails?.[0].value,
//             googleId: profile.id,
//             firstName: profile.name?.givenName || "",
//             lastName: profile.name?.familyName || "",
//             isEmailVerified: true, // Auto-verify for Google users
//             password: Math.random().toString(36).slice(-10), // Random password as placeholder
//             role: "candidate", // Default role for new users
//           });
//         }

//         return done(null, user as any);
//       } catch (error) {
//         return done(error as Error, false);
//       }
//     }
//   )
// );

// Serialization and Deserialization (required for sessions if you use them)
// passport.serializeUser((user: Express.User, done) => {
//   done(null, user._id);
// });

// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const user = (await User.findById(id)) as Express.User;
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

export default passport;
