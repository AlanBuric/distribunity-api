import { StatusCodes } from "http-status-codes";
import type { UserRegistrationRequest } from "../../types/data-transfer-objects.js";
import type { User } from "../../types/database-types.js";
import RequestError from "../../utils/RequestError.js";
import * as SessionService from "../session/service.js";
import database from "../../services/database.js";
import { camelCaseify } from "../../utils/database.js";
import getLoggingPrefix from "../../utils/logging.js";

export async function registerUser(
  registration: UserRegistrationRequest
): Promise<User> {
  const hashedPassword = await SessionService.hashPassword(
    registration.password
  );
  const {
    rows: [{ password_hash, ...user }],
  } = await database
    .query(
      `
      INSERT INTO "user" (first_name, last_name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        registration.firstName,
        registration.lastName,
        registration.email,
        hashedPassword,
      ]
    )
    .catch((error) => {
      if (error.code == "23505") {
        throw new RequestError(StatusCodes.BAD_REQUEST, "Email already taken");
      }

      console.error(
        `${getLoggingPrefix()} Unknown error caught during user registration`,
        error
      );

      throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR);
    });

  return camelCaseify(user);
}

export async function getUserById(id: number): Promise<User> {
  const {
    rows: [user],
    rowCount,
  } = await database.query(
    `
    SELECT user_id, created_at, first_name, last_name, email
    FROM "user"
    WHERE user_id = $1
    `,
    [id]
  );

  if (!rowCount) {
    throw new RequestError(
      StatusCodes.NOT_FOUND,
      `User with ID ${id} not found`
    );
  }

  return camelCaseify(user);
}

export async function getUserByEmail(email: string): Promise<User> {
  const {
    rows: [user],
    rowCount,
  } = await database.query(
    `
    SELECT * 
    FROM "user" 
    WHERE email = $1
    `,
    [email]
  );

  if (!rowCount) {
    throw new RequestError(
      StatusCodes.NOT_FOUND,
      `User with email ${email} not found`
    );
  }

  return camelCaseify(user);
}
