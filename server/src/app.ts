import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
// import { createServer } from "http";
// import { Server } from "socket.io";
import connectDb from "./config/db";
import rateLimit from "express-rate-limit";
import config from "./config/config";
import passport from "./config/passport";
import authRoutes from "./routes/authRoutes";
import { errorHandler, AppError } from "./middlewares/error";

const app = express();

// connect to mongoDB
connectDb();

app.use(helmet());
app.use(
  cors({
    origin: config.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send({ status: "ok" });
});

// 404 handler
app.all("*", (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

export { app };
