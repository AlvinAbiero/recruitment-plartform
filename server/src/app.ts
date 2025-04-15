import express from "express";
import { Request, Response, } from "express";
import cors from "cors";
import helmet from "helmet";
// import { createServer } from "http";
// import { Server } from "socket.io";
import rateLimit from "express-rate-limit";
import config from "./config/config";
import passport from "./config/passport";
import { errorHandler } from "./middlewares/error";

const app = express();
// const httpServer = createServer(app);

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
app.use("/api/auth");

app.get("/health", (_req: Request, res : Response) => {
  res.status(200).send({ status: "ok" });
});

app.use(errorHandler);

export { app };
