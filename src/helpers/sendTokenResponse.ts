import { IUser } from "../models/user";
import { Response } from "express";

export const sendTokenResponse = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const token = user.getSignedJwtToken();

  const options: Options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 1000 * 60 * 60 * 24
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
