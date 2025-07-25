import { StatusCodes } from 'http-status-codes';
import type { UserView, UserRegistrationRequest } from '../../types/data-transfer-objects.js';
import type { DbUser } from '../../types/database-types.js';
import RequestError from '../../utils/RequestError.js';
import { camelCaseify } from '../../utils/database.js';
import getLoggingPrefix from '../../utils/logging.js';
import getDatabase from '../../services/database.js';
import { hashPassword } from '../session/service.js';
import getRedis from '../../services/redis.js';
import { REDIS_USER_IDS } from '../../utils/constants.js';

export async function registerUser(registration: UserRegistrationRequest): Promise<UserView> {
  const hashedPassword = await hashPassword(registration.password);
  const {
    rows: [{ password_hash, ...user }],
  } = await getDatabase()
    .query(
      `
      INSERT INTO "user" (first_name, last_name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [registration.firstName, registration.lastName, registration.email, hashedPassword],
    )
    .catch((error) => {
      if (error.code == '23505') {
        throw new RequestError(StatusCodes.BAD_REQUEST, 'Email already taken');
      }

      console.error(`${getLoggingPrefix()} Unknown error caught during user registration`, error);

      throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR);
    });

  await getRedis().sAdd(REDIS_USER_IDS, user.user_id);

  return camelCaseify(user);
}

export async function getUserById(id: number): Promise<DbUser> {
  const {
    rows: [user],
    rowCount,
  } = await getDatabase().query('SELECT * FROM "user" WHERE user_id = $1', [id]);

  if (!rowCount) throw new RequestError(StatusCodes.NOT_FOUND, `User with ID ${id} not found`);

  return camelCaseify(user);
}

export async function getUserByEmail(email: string): Promise<DbUser> {
  const {
    rows: [user],
    rowCount,
  } = await getDatabase().query(
    `
    SELECT * 
    FROM "user" 
    WHERE email = $1
    `,
    [email],
  );

  if (!rowCount) {
    throw new RequestError(StatusCodes.NOT_FOUND, `User with email ${email} not found`);
  }

  return camelCaseify(user);
}
