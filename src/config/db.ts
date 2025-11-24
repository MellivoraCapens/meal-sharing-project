import mongoose from "mongoose";
import { logger } from "../helpers/logger";

export const connectDB = async () => {
  const conn = mongoose.connect(`${process.env.MONGO_URL}`);

  if ((await conn).Error.DocumentNotFoundError === null) {
    logger.ERROR((await conn).Error);
  }

  logger.INFO(`MongoDB Connected: ${(await conn).connection.host}`);
};
