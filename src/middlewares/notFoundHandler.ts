import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  throw new ErrorResponse(`Cannot ${req.method} ${req.originalUrl}`, 404);
};

export default notFoundHandler;
