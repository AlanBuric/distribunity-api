import { createClient } from "redis";
import getLoggingPrefix from "../utils/logging.js";

// Tries to minimize Redis' connection retry spam.
let lastError: Error | undefined = undefined;
let lastConnected: number | undefined = undefined;

const redis = createClient()
  .on("error", (error) => {
    if (!lastError || !(lastError instanceof error.constructor)) {
      console.error(`${getLoggingPrefix()} Redis Client error`, error);
    }

    lastError = error;
  })
  .on("connect", () => {
    const now = Date.now();

    if (!lastConnected || now - lastConnected > 1000) {
      lastConnected = now;
      console.info(`${getLoggingPrefix()} Connected to Redis.`);
    }
  });

export default redis;
