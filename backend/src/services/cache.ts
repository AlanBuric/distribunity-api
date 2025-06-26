import type { PermissionType } from '../types/database-types.js';
import {
  REDIS_COUNTRY_CODES_SET,
  REDIS_PERMISSION_NAME,
  REDIS_PERMISSION_ID,
  REDIS_ORGANIZATION_MEMBERS,
  REDIS_USER_IDS,
} from '../utils/constants.js';
import getLoggingPrefix from '../utils/logging.js';
import { getElapsedTime } from '../utils/time.js';
import getDatabase from './database.js';
import getRedis from './redis.js';

type DbUser = { user_id: string };
type DbCountryCode = { country_code: string };
type DbPermission = { permission_id: number; name: PermissionType };
type DbOrganizationMember = { organization_id: number; user_id: number };

export async function initializeCache() {
  const start = process.hrtime.bigint();

  await Promise.all([
    initializerUserSet(start),
    initializeCountries(start),
    initializePermissions(start),
    initializeOrganizationMembers(start),
  ]);
}

async function initializeCountries(start: bigint) {
  const redis = getRedis();

  if ((await redis.sCard(REDIS_COUNTRY_CODES_SET)) > 0) return;

  await getDatabase()
    .query<DbCountryCode>('SELECT country_code FROM country')
    .then(async ({ rows, rowCount }) => {
      await Promise.all(
        rows.map(({ country_code }) => redis.sAdd(REDIS_COUNTRY_CODES_SET, country_code)),
      );

      console.info(
        `${getLoggingPrefix()} Redis set of ${rowCount} country codes initialized in ${getElapsedTime(
          start,
        )} ms.`,
      );
    });
}

async function initializePermissions(start: bigint) {
  const redis = getRedis();

  if ((await redis.scan('0', { MATCH: 'pId:*', TYPE: 'string' })).keys.length) return;

  await getDatabase()
    .query<DbPermission>('SELECT * FROM permission')
    .then(async ({ rows, rowCount }) => {
      await Promise.all(
        rows.flatMap(({ permission_id: id, name }) => [
          redis.set(REDIS_PERMISSION_NAME(name), id),
          redis.set(REDIS_PERMISSION_ID(id), name),
        ]),
      );

      console.info(
        `${getLoggingPrefix()} Redis set of ${rowCount} permissions initialized in ${getElapsedTime(
          start,
        )} ms.`,
      );
    });
}

async function initializerUserSet(start: bigint) {
  const redis = getRedis();

  await getDatabase()
    .query<DbUser>('SELECT user_id FROM "user"')
    .then(async ({ rows, rowCount }) => {
      await Promise.all(rows.map(({ user_id }) => redis.sAdd(REDIS_USER_IDS, user_id)));

      console.info(
        `${getLoggingPrefix()} Redis set of ${rowCount} user IDs initialized in ${getElapsedTime(start)} ms.`,
      );
    });
}

async function initializeOrganizationMembers(start: bigint) {
  const redis = getRedis();

  if ((await redis.scan('0', { MATCH: 'om:*', TYPE: 'set' })).keys.length) return;

  await getDatabase()
    .query<DbOrganizationMember>('SELECT * FROM organization_member')
    .then(async ({ rows, rowCount }) => {
      await Promise.all(
        rows.map(({ organization_id, user_id }) =>
          redis.sAdd(REDIS_ORGANIZATION_MEMBERS(organization_id), user_id.toString()),
        ),
      );

      console.info(
        `${getLoggingPrefix()} Redis set of ${rowCount} organization member relations initialized in ${getElapsedTime(
          start,
        )} ms.`,
      );
    });
}
