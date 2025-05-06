// // Create a new file: jwt-diagnostics.ts
// import jwt from "jsonwebtoken";
// import config from "../config/config";

// export const diagnoseJwtIssue = () => {
//   console.log("\n🔍 JWT DIAGNOSTICS 🔍");
//   console.log("-----------------------");

//   // Check if JWT_SECRET is defined and consistent
//   const secret = config.JWT_SECRET;
//   if (!secret) {
//     console.error("❌ JWT_SECRET is not defined in config!");
//     console.log(
//       "Make sure your .env file or environment variables are properly set."
//     );
//     return false;
//   }

//   console.log(
//     `✅ JWT_SECRET is defined (first few chars: ${secret.substring(0, 3)}...)`
//   );

//   // Try to generate and verify a simple token to test the secret
//   try {
//     const testPayload = { test: "diagnostic" };
//     console.log("🔑 Generating test token with payload:", testPayload);

//     const testToken = jwt.sign(testPayload, secret, { expiresIn: "5m" });
//     console.log(`✅ Test token generated: ${testToken.substring(0, 20)}...`);

//     // Try to verify the token we just created
//     const verified = jwt.verify(testToken, secret);
//     console.log("✅ Test token verified successfully:", verified);

//     return true;
//   } catch (error) {
//     console.error("❌ JWT test failed:", error.message);
//     return false;
//   }
// };

// // Helper to verify a specific token
// export const verifySpecificToken = (token: string) => {
//   try {
//     console.log("\n🔍 VERIFYING SPECIFIC TOKEN 🔍");
//     console.log("------------------------------");
//     console.log(`Token to verify: ${token.substring(0, 15)}...`);

//     const decoded = jwt.verify(token, config.JWT_SECRET);
//     console.log("✅ Token verified successfully:", decoded);
//     return decoded;
//   } catch (error) {
//     console.error("❌ Token verification failed:", error);

//     // If it's an expired token, make that clear
//     if (error.name === "TokenExpiredError") {
//       console.log(
//         "⏰ The token has expired. Please generate a new one by logging in again."
//       );
//     }
//     // If it's an invalid signature, the secret is different
//     else if (
//       error.name === "JsonWebTokenError" &&
//       error.message.includes("signature")
//     ) {
//       console.log(
//         "🔐 The token was signed with a different secret than the one currently used."
//       );
//       console.log("Check if your JWT_SECRET env variable has changed.");
//     }

//     return null;
//   }
// };
