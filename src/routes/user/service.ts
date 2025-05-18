import { StatusCodes } from "http-status-codes";
import type { UserRegistrationRequest } from "../../types/data-transfer-objects.js";
import type { User } from "../../types/database-types.js";
import RequestError from "../../utils/RequestError.js";
import * as SessionService from "../session/service.js";
import database from "../../database/database.js";
import { camelCaseify } from "../../utils/database.js";

export async function registerUser(
  registration: UserRegistrationRequest
): Promise<User> {
  const { rowCount } = await database.query(
    `
      SELECT 1
      FROM users
      WHERE email = $1
      `,
    [registration.email]
  );

  if (rowCount) {
    throw new RequestError(
      StatusCodes.BAD_REQUEST,
      `E-mail ${registration.email} is already taken`
    );
  }

  const hashedPassword = await SessionService.hashPassword(
    registration.password
  );
  const {
    rows: [user],
  } = await database.query(
    `
      INSERT INTO users (first_name, last_name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING (id, created_at, first_name, last_name, email)
      `,
    [
      registration.firstName,
      registration.lastName,
      registration.email,
      hashedPassword,
    ]
  );

  return camelCaseify(user);
}

export async function getUserById(id: number): Promise<User> {
  const {
    rows: [user],
    rowCount,
  } = await database.query(
    `
    SELECT user_id, created_at, first_name, last_name, email
    FROM Users
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
    FROM users 
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
