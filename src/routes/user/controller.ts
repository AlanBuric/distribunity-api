import type { Request, Response } from "express";
import type {
  AuthorizedLocals,
  ErrorResponse,
} from "../../types/data-transfer-objects.js";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { getUserById } from "./service.js";
import type { User } from "../../types/database-types.js";

type UserRequest = { userId: number };

export async function GET(
  request: Request,
  response: Response<ErrorResponse | User, AuthorizedLocals>
): Promise<any> {
  const { userId } = matchedData<UserRequest>(request);

  if (response.locals.userId != userId) {
    return response.status(StatusCodes.FORBIDDEN);
  }

  const { passwordHash, ...user } = await getUserById(userId);

  response.send(user);
}
