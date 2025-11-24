import app from "./app";
import { connectDB } from "./config/db";
import config from "./config/config";
import { logger } from "./helpers/logger";

connectDB();

app.listen(config.port, () => {
  logger.INFO(
    `Server running in ${config.nodeEnv} mode on port ${config.port}`
  );
});
