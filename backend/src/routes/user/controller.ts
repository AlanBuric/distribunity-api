import type { Request, Response } from 'express';
import type {
  AuthorizedLocals,
  ErrorResponse,
  SelfUserView,
} from '../../types/data-transfer-objects.js';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { getUserById } from './service.js';
import getDatabase from '../../services/database.js';
import { logoutUser } from '../session/controller.js';
import getLoggingPrefix from '../../utils/logging.js';

type UserRequest = { userId: number };

export async function getSelfUser(
  request: Request,
  response: Response<ErrorResponse | SelfUserView, AuthorizedLocals>,
): Promise<any> {
  const { userId } = matchedData<UserRequest>(request);

  if (response.locals.userId != userId) {
    return response.sendStatus(StatusCodes.FORBIDDEN);
  }

  const { passwordHash, ...user } = await getUserById(userId);

  response.send(user);
}

export async function deleteSelfUser(
  request: Request,
  response: Response<ErrorResponse, AuthorizedLocals>,
) {
  await getDatabase()
    .query(`DELETE FROM "user" WHERE user_id = $1`, [response.locals.userId])
    .then(() => logoutUser(request, response))
    .catch((error) => {
      if (error.code != '23503')
        console.error(`${getLoggingPrefix()} Unhandled SQL error during user deletion`, error);

      response
        .status(StatusCodes.BAD_REQUEST)
        .send("Please transfer your organizations' ownerships before deleting your account");
    });
}
