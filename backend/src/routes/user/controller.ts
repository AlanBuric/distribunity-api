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
import { matchedData, type Meta } from 'express-validator';
import { verifyPassword } from '../session/service.js';
import { getSqlPatchColumns } from '../../utils/database.js';

const lowercaseRegEx = /[a-z]/;
const uppercaseRegEx = /[A-Z]/;
const numberRegEx = /[0-9]/;
const symbolRegEx = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

function getPasswordProblem(password: string, email?: string) {
  if (!numberRegEx.test(password)) return 'Password must include a number';
  if (!symbolRegEx.test(password)) return 'Password must include a symbol';
  if (!lowercaseRegEx.test(password)) return 'Password must include a lowercase letter';
  if (!uppercaseRegEx.test(password)) return 'Password must include an uppercase letter';

  if (email) {
    const user = email.split('@')[0].toLowerCase();

    if (password.toLowerCase().includes(user)) return 'Password must not include email username';
  }

  return null;
}

export function validatePassword(input: string, meta: Meta) {
  const error = getPasswordProblem(input, meta.req.body?.email);

  if (error) throw new Error(error);

  return true;
}

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
    .query(`DELETE FROM "user" WHERE user_id = $1 AND is_app_admin IS NOT TRUE`, [
      response.locals.userId,
    ])
    .then(({ rowCount }) => {
      if (!rowCount) {
        return response
          .status(StatusCodes.FORBIDDEN)
          .send('Web application administrator accounts cannot be deleted.');
      }

      logoutUser(request, response);
    })
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

  // TODO: change password, check stuff, unhash, hash...

  if (!verifyPassword(oldPassword, user.passwordHash))
    return response.status(StatusCodes.BAD_REQUEST).send('Wrong old password');
}

export async function editSelfUser(
  request: Request,
  response: Response<ErrorResponse, AuthorizedLocals>,
): Promise<any> {
  const { firstName, lastName, theme, language } = matchedData(request);

  const [set, args] = getSqlPatchColumns(
    [
      ['firstName', firstName],
      ['lastName', lastName],
      ['theme', theme],
      ['language', language],
    ],
    response.locals.userId,
  );

  await getDatabase().query(`UPDATE "user" SET ${set} WHERE user_id = $${args.length}`, args);

  response.sendStatus(StatusCodes.NO_CONTENT);
}
