import winston, { createLogger, transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const { combine, timestamp, printf, errors, colorize, prettyPrint, json } =
  format;

const customLevels = {
  levels: {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    HTTP: 3,
    DEBUG: 4,
  },
  colors: {
    ERROR: "red",
    WARN: "yellow",
    INFO: "green",
    HTTP: "magenta",
    DEBUG: "cyan",
  },
};

winston.addColors(customLevels.colors);

const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `\x1b[90m${timestamp}\x1b[39m [${level}]: ${message} ${
    stack ? stack : ""
  }`;
});

export const logger = createLogger({
  levels: customLevels.levels,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json(),
    prettyPrint()
  ),
  transports: [
    new DailyRotateFile({
      level: "INFO",
      filename: path.join("logs", "info", "%DATE%-info.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      level: "WARN",
      filename: path.join("logs", "error", "%DATE%-error.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "30d",
    }),
    new transports.Console({
      level: "DEBUG",
      format: combine(
        errors({ stack: true }),
        colorize({ level: true }),
        consoleFormat
      ),
    }),
  ],
}) as winston.Logger &
  Record<keyof (typeof customLevels)["levels"], winston.LeveledLogMethod>;
