import { createClient } from "redis";
import getLoggingPrefix from "../utils/logging.js";

const redis = createClient();

redis.on("error", (error) =>
  console.error(`${getLoggingPrefix()} Redis Client Error`, error)
);

export default redis;
