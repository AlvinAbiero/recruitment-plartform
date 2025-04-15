import jwt, { SignOptions, Secret, JwtPayload } from "jsonwebtoken";
// import { UserRole } from "../models/User";
// import config from "../config/";
import config from "../config/config";
import { IUser } from "../models/User";

const JWT_SECRET = config.JWT_SECRET || ("" as Secret);
// Define a type for the expiresIn value
const JWT_EXPIRES_IN = config.JWT_EXPIRES_IN || "1d";

export const generateToken = (user: IUser): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const options: SignOptions = {
    // Use a direct cast to any to bypass type checking
    expiresIn: JWT_EXPIRES_IN as any,
  };

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    options
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};

// interface TokenPayload {
//   id: string;
//   role: UserRole;
// }

// export const generateToken = (payload: TokenPayload): string => {
//   const secret = config.JWT_SECRET;
//   const expiresIn = config.JWT_EXPIRE;

//   if (!secret) {
//     throw new Error("JWT secret is not defined"); // Handle the error appropriately
//   }
//   return jwt.sign(payload, secret as string, { expiresIn });
// };
