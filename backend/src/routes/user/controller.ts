import type { Request, Response } from 'express';
import type {
  AuthorizedLocals,
  ErrorResponse,
  UserView,
} from '../../types/data-transfer-objects.js';
import { StatusCodes } from 'http-status-codes';
import { getUserById } from './service.js';
import getDatabase from '../../services/database.js';
import { logoutUser } from '../session/controller.js';
import getLoggingPrefix from '../../utils/logging.js';
import { matchedData } from 'express-validator';
import { verifyPassword } from '../session/service.js';

export async function getSelfUser(
  _request: Request,
  response: Response<ErrorResponse | UserView, AuthorizedLocals>,
): Promise<any> {
  const { passwordHash, ...user } = await getUserById(response.locals.userId);

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

type PasswordChangeRequest = {
  oldPassword: string;
  newPassword: string;
};

export async function changeSelfUserPassword(
  request: Request<PasswordChangeRequest>,
  response: Response<ErrorResponse, AuthorizedLocals>,
): Promise<any> {
  const { oldPassword, newPassword } = matchedData<PasswordChangeRequest>(request);

  const user = await getUserById(response.locals.userId);

  if (!verifyPassword(oldPassword, user.passwordHash))
    return response.status(StatusCodes.BAD_REQUEST).send('Wrong old password');
}

export async function editSelfUser(
  request: Request,
  response: Response<ErrorResponse, AuthorizedLocals>,
): Promise<any> {}
