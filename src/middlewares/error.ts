import ErrorResponse from "../utils/errorResponse";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { logger } from "../helpers/logger";

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (err instanceof mongoose.Error.CastError) {
    error = new ErrorResponse(`User not found with id of ${err.value}`, 404);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(messages.join(", "), 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  const status = error.statusCode || 500;
  const message = error.message || "Server Error";

  logger.ERROR(`${message} ${error.statusCode}`, { stack: error.stack });

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export default errorHandler;
