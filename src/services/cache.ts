import type { Permission } from "../types/database-types.js";
import {
  REDIS_COUNTRY_CODES_SET,
  REDIS_PERMISSION_NAME,
  REDIS_PERMISSION_ID,
  REDIS_ORGANIZATION_MEMBERS,
} from "../utils/constants.js";
import getLoggingPrefix from "../utils/logging.js";
import { getElapsedTime } from "../utils/time.js";
import database from "./database.js";
import redis from "./redis.js";

type DbCountryCode = { country_code: string };
type DbPermission = { permission_id: number; name: Permission };
type DbOrganizationMember = { organization_id: number; user_id: number };

export async function initializeCache() {
  const start = process.hrtime.bigint();

  await Promise.all([
    initializeCountries(start),
    initializePermissions(start),
    initializeOrganizationMembers(start),
  ]);
}

async function initializeCountries(start: bigint) {
  if (await redis.exists(REDIS_COUNTRY_CODES_SET)) return;

  await database
    .query<DbCountryCode>("SELECT country_code FROM country")
    .then(async ({ rows, rowCount }) => {
      await Promise.all(
        rows.map(({ country_code }) =>
          redis.sAdd(REDIS_COUNTRY_CODES_SET, country_code)
        )
      );

      console.info(
        `${getLoggingPrefix()} Redis set of ${rowCount} country codes initialized in ${getElapsedTime(
          start
        )} ms.`
      );
    });
}

async function initializePermissions(start: bigint) {
  if ((await redis.scan("0", { MATCH: "pId:*", TYPE: "string" })).keys.length)
    return;

  await database
    .query<DbPermission>("SELECT * FROM permission")
    .then(async ({ rows, rowCount }) => {
      await Promise.all(
        rows.flatMap(({ permission_id: id, name }) => [
          redis.set(REDIS_PERMISSION_NAME(name), id),
          redis.set(REDIS_PERMISSION_ID(id), name),
        ])
      );

      console.info(
        `${getLoggingPrefix()} Redis set of ${rowCount} permissions initialized in ${getElapsedTime(
          start
        )} ms.`
      );
    });
}

async function initializeOrganizationMembers(start: bigint) {
  if ((await redis.scan("0", { MATCH: "om:*", TYPE: "set" })).keys.length)
    return;

  await database
    .query<DbOrganizationMember>("SELECT * FROM organization_member")
    .then(async ({ rows, rowCount }) => {
      await Promise.all(
        rows.map(({ organization_id, user_id }) =>
          redis.sAdd(
            REDIS_ORGANIZATION_MEMBERS(organization_id),
            user_id.toString()
          )
        )
      );

      console.info(
        `${getLoggingPrefix()} Redis set of ${rowCount} organization member relations initialized in ${getElapsedTime(
          start
        )} ms.`
      );
    });
}
