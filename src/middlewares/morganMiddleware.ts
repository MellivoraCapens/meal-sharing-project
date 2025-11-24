import morgan from "morgan";
import { logger } from "../helpers/logger";

export const morganMiddleware = morgan((tokens, req, res) => {
  const status = res.statusCode;
  const method = tokens.method?.(req, res);
  const url = tokens.url?.(req, res);
  const responseTime = tokens["response-time"]?.(req, res);

  const msg = `${method} ${url} ${status} - ${responseTime}ms`;

  if (status >= 500) null;
  else if (status >= 400) null;
  else logger.INFO(msg);

  return null;
});
