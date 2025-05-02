require("dotenv").config();

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGO_URI:
    process.env.MONGO_URI || "mongodb://localhost:27017/ai-recruitment",

  // JWT Configuration
  JWT_SECRET:
    process.env.JWT_SECRET || "your-default-jwt-secret-key-for-development",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  OAUTH_CALLBACK_URL: process.env.OAUTH_CALLBACK_URL || "",

  // Frontend and API URLs
  API_URL: process.env.API_URL || "http://localhost:5000",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",

  // Email Configuration
  EMAIL_FROM: process.env.EMAIL_FROM || "no-reply@example.com",
  EMAIL_USERNAME: process.env.EMAIL_USERNAME || "",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
};

export default config;
