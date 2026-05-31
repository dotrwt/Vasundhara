import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered. The ${field} must be unique.`;
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
  }

  // Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Not authorized, token signature is invalid";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Not authorized, token has expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
