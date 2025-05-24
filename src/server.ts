import "dotenv/config";
import database from "./services/database.js";
import redis from "./services/redis.js";
import { styleText } from "node:util";
import { validateConfigValue } from "./utils/config.js";
import getLoggingPrefix from "./utils/logging.js";
import application from "./application.js";
import {
  REDIS_COUNTRY_CODES_SET,
  REDIS_PERMISSION_ID,
  REDIS_PERMISSION_NAME,
} from "./utils/constants.js";
import type { Permission } from "./types/database-types.js";

const port = Number(validateConfigValue("PORT"));

await Promise.all([redis.connect(), database.connect()]);

database
  .query<{ country_code: string }>("SELECT country_code FROM country")
  .then(async ({ rows, rowCount }) => {
    await Promise.all(
      rows.map(({ country_code }) =>
        redis.sAdd(REDIS_COUNTRY_CODES_SET, country_code)
      )
    );

    console.info(
      `${getLoggingPrefix()} Redis set of ${rowCount} country codes initialized.`
    );
  });

database
  .query<{ permission_id: number; name: Permission }>(
    "SELECT * FROM permission"
  )
  .then(async ({ rows, rowCount }) => {
    await Promise.all(
      rows.flatMap(({ permission_id: id, name }) => [
        redis.set(REDIS_PERMISSION_NAME(name), id),
        redis.set(REDIS_PERMISSION_ID(id), name),
      ])
    );

    console.info(
      `${getLoggingPrefix()} Redis set of ${rowCount} permissions initialized.`
    );
  });

application.listen(port, () =>
  console.info(
    styleText(
      ["blueBright"],
      `${getLoggingPrefix()} Distribunity API server started on http://localhost:${port}/api/v1`
    )
  )
);
