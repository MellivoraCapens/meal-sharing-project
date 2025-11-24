import { LeveledLogMethod } from "winston";
import winston from "winston/lib/winston/config";

export {};

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }

  declare namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGO_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      JWT_COOKIE_EXPIRE: number;
      SMTP_HOST: string;
      SMTP_PORT: number;
      SMTP_EMAIL: string;
      SMTP_PASSWORD: string;
      FROM_NAME: string;
      FROM_EMAIL: string;
      RESET_EXPIRE: number;
      NODE_ENV: "development" | "production";
    }
  }

  interface Options {
    secure?: boolean;
    expires: Date;
    httpOnly: boolean;
  }

  interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    value?: string;
    errors?: Record<string, { message: string }>;
  }

  interface EmailOptions {
    email: string;
    subject: string;
    message: string;
  }
}
