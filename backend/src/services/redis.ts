import { createClient } from 'redis';
import getLoggingPrefix from '../utils/logging.js';
import EnvConfig from '../utils/config.js';

// Tries to minimize Redis' connection retry spam.
let lastError: Error | undefined = undefined;
let lastConnected: number | undefined = undefined;
let redis: ReturnType<typeof createClient> | undefined = undefined;

export async function connectRedis() {
  redis = createClient({ url: EnvConfig.REDIS_URL })
    .on('error', (error) => {
      if (!lastError || !(lastError instanceof error.constructor)) {
        console.error(`${getLoggingPrefix()} Redis Client error`, error);
      }

      lastError = error;
    })
    .on('connect', () => {
      const now = Date.now();

      if (!lastConnected || now - lastConnected > 1000) {
        lastConnected = now;
        console.info(`${getLoggingPrefix()} Connected to Redis.`);
      }
    });

  await redis.connect();
}

export default function getRedis() {
  if (!redis) throw new Error('Redis connection is uninitialized');

  return redis;
}
