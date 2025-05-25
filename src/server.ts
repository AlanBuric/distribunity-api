import "dotenv/config";
import database from "./services/database.js";
import redis from "./services/redis.js";
import { styleText } from "node:util";
import { validateConfigValue } from "./utils/config.js";
import getLoggingPrefix from "./utils/logging.js";
import application from "./application.js";
import { initializeCache } from "./services/cache.js";

const port = Number(validateConfigValue("PORT"));

await Promise.all([
  redis.connect(),
  database
    .connect()
    .then(() =>
      console.info(`${getLoggingPrefix()} Connected to PostgreSQL database.`)
    ),
]);
await initializeCache();

application.listen(port, () =>
  console.info(
    styleText(
      ["blueBright"],
      `${getLoggingPrefix()} Distribunity API server started on http://localhost:${port}/api/v1`
    )
  )
);
