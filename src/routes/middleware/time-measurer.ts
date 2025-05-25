import type { Request, Response, NextFunction } from "express";
import getLoggingPrefix from "../../utils/logging.js";
import { getElapsedTime } from "../../utils/time.js";

/**
 * Benchmark and debug utility.
 */
export function measureResponseTime(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = process.hrtime.bigint();

  res.on("finish", () =>
    console.debug(
      `${getLoggingPrefix()} [${req.method}] ${
        req.originalUrl
      } - ${getElapsedTime(start).toFixed(2)} ms`
    )
  );

  next();
}
