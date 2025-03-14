import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";
import config from "../config/config";

declare module "express" {
  export interface Request {
    user?: any;
  }
}

// jwt strategy

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Bearer header
  secretOrKey: config.JWT_SECRET as string, // Secret key for verification
};

passport.use(
  new JWTStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById({ id: jwt_payload.id });
      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.OAUTH_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
          });
        }

        return cb(null, user);
      } catch (error) {
        return cb(error, false);
      }
    }
  )
);

// Persists user data inside session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Fetches session details using session id
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

export default passport;
