import { Response, Request, NextFunction } from "express";
import User from "../models/user";
import { asyncHandler } from "../middlewares/asyncHandler";
import ErrorResponse from "../utils/errorResponse";

// @desc    get all users
// @route   GET /api/v1/user/get-all
// @access  private
export const getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    res.status(200).json({
      success: true,
      data: users,
    });
  }
);

// @desc    create user
// @route   POST /api/v1/user/create
// @access  private
export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// @desc    show single user
// @route   GET /api/v1/user/get/:id
// @access  private
export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// @desc    update user
// @route   PUT /api/v1/user/update/:id
// @access  private
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// @desc    delete user
// @route   DELETE /api/v1/user/delete/:id
// @access  private
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);
