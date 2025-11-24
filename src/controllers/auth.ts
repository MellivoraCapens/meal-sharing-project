import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import ErrorResponse from "../utils/errorResponse";
import { asyncHandler } from "../middlewares/asyncHandler";
import { sendTokenResponse } from "../helpers/sendTokenResponse";
import sendEmail from "../utils/sendEmail";
import crypto from "crypto";

// @desc    update password
// @route   PUT /api/v1/auth/updatepassword
// @access  private
export const updatePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.user.id}`, 404)
      );
    }

    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse("Password is incorrect", 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  }
);

// @desc    register user
// @route   POST /api/v1/auth/register
// @access  public
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullname, nickname, email, password } = req.body;

    const user = await User.create({
      fullname,
      nickname,
      email,
      password,
    });

    sendTokenResponse(user, 200, res);
  }
);

// @desc    login user
// @route   POST /api/v1/auth/login
// @access  public
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and a password", 400)
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendTokenResponse(user, 200, res);
  }
);

// @desc    forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  public
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorResponse("There is no user with that email", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this mail because you (or someone else) has requested the reset of a password.
  Please make a PUT requested to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
      });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse("Email could not be sent", 500));
    }

    res.status(200).json({
      success: true,
      data: user,
      ...(process.env.NODE_ENV === "development" && { token: resetToken }),
    });
  }
);

// @desc    reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  public
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.resettoken) {
      return next(new ErrorResponse("Token not found", 404));
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    sendTokenResponse(user, 200, res);
  }
);
