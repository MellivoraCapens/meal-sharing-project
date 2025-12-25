import { Request, Response, NextFunction } from "express";
import Complaint from "../models/complaint";
import ErrorResponse from "../utils/errorResponse";
import { asyncHandler } from "../middlewares/asyncHandler";

// @desc    create Complaint
// @route   POST /api/v1/complaint
// @access  private
export const createComplaint = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { subjectId, orderId, description } = req.body;

    if (!req.user) {
      new ErrorResponse("Not authorized to access this route", 401);
    }

    const complaint = Complaint.create({
      subjectId,
      orderId,
      description,
      reportedById: req.user._id,
    });

    res.status(200).json({
      success: true,
      data: complaint,
    });
  }
);
