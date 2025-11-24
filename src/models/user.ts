import mongoose, { Schema, InferSchemaType, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import slugify from "slugify";

interface UserMethods {
  getSignedJwtToken(): string;
  getResetPasswordToken(): string;
  matchPassword(enteredPassword: string): boolean;
}

const UserSchema = new Schema({
  fullname: {
    type: String,
    required: [true, "Please add a name and a surname"],
  },
  nickname: {
    type: String,
    required: [true, "Please add a Nickname"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 9,
    select: false,
  },
  isChef: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true,
  },
});

export type UserSchemaType = InferSchemaType<typeof UserSchema>;
export type IUser = HydratedDocument<UserSchemaType, UserMethods>;

UserSchema.pre("save", function (next) {
  this.slug = slugify(this.nickname, { lower: true });
  next();
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
  const secret = process.env.JWT_SECRET;
  const expire = process.env.JWT_EXPIRE;
  if (!secret || !expire) {
    throw new Error(
      "JWT_SECRET and JWT_EXPIRE must be defined in environment variables"
    );
  }
  return jwt.sign({ id: this._id }, secret, {
    expiresIn: expire,
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + process.env.RESET_EXPIRE;

  return resetToken;
};

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
