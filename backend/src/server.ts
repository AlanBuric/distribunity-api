import 'dotenv/config';
import { connectDatabase } from './services/database.js';
import { connectRedis } from './services/redis.js';
import { styleText } from 'node:util';
import EnvConfig from './utils/config.js';
import getLoggingPrefix from './utils/logging.js';
import { initializeCache } from './services/cache.js';
import getRedis from './services/redis.js';
import getDatabase from './services/database.js';
import createApplication from './application.js';

EnvConfig.initialize();

await Promise.all([connectRedis(), connectDatabase()]).then(initializeCache);

const server = createApplication().listen(EnvConfig.PORT, () =>
  console.info(
    styleText(['blueBright', 'bold'], '✔ Distribunity service is up and running:'),
    '\n',
    styleText(
      ['blue'],
      `➥ API routes: ${styleText(['underline'], `http://localhost:${EnvConfig.PORT}/api/v1`)}`,
    ),
    '\n',
    styleText(
      ['blue'],
      `➥ Healthcheck: ${styleText(['underline'], `http://localhost:${EnvConfig.PORT}/health`)}`,
    ),
  ),
);

const gracefulShutdown = async () => {
  console.info(`${getLoggingPrefix()} Shutting down gracefully...`);

  await Promise.allSettled([getRedis().quit(), getDatabase().end()]);

  server.close((error) => {
    if (error)
      console.error('An error occurred while shutting down the Distribunity service', error);

    console.info(`${getLoggingPrefix()} Server closed.`);
    process.exit(0);
  });
};

process.once('SIGINT', gracefulShutdown).once('SIGTERM', gracefulShutdown);
