import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;
  status: string
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = "statusCode" in err ? err.statusCode : 500;
  const isOperational = "isOperational" in err ? err.isOperational : false;

  // log error
  console.error("ERROR:", err);

  // Operational, trusted error: send message to client
  if (isOperational) {
    return res.status(statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Programming or other unknown error: dont leak error details
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};
