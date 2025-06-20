import { request, Request, response, Response, type NextFunction } from 'express';
import type {
  AuthorizedLocals,
  ErrorResponse,
  UserLoginResponse,
} from '../../types/data-transfer-objects.js';
import {
  addTokenToDenylist,
  generateJwtToken,
  getJwtTokenPayload,
  isEligibleForRefresh,
  isTokenOnDenylist,
  TokenType,
  verifyPassword,
} from './service.js';
import { StatusCodes } from 'http-status-codes';
import { matchedData } from 'express-validator';
import getDatabase from '../../services/database.js';
import type { DbUser } from '../../types/database-types.js';
import { camelCaseify } from '../../utils/database.js';
import getRedis from '../../services/redis.js';
import { REDIS_USER_IDS } from '../../utils/constants.js';
import getLoggingPrefix from '../../utils/logging.js';

type UserLoginRequest = {
  email: string;
  password: string;
};

export async function logInUser(
  request: Request<
    Record<string, never>,
    Record<string, never>,
    UserLoginRequest,
    Record<string, never>
  >,
  response: Response<UserLoginResponse | ErrorResponse>,
): Promise<any> {
  const { email, password } = matchedData(request);

  const {
    rows: [dbFullUser],
    rowCount,
  } = await getDatabase().query('SELECT * FROM "user" WHERE email = $1', [email]);

  if (!rowCount) return response.status(StatusCodes.NOT_FOUND).send('Unknown e-mail');

  const fullUser = camelCaseify<DbUser>(dbFullUser);

  if (await verifyPassword(password, fullUser.passwordHash!)) {
    const { passwordHash, ...user } = fullUser;
    const [{ token: accessToken, expiration }, refreshToken] = await Promise.all([
      generateJwtToken(user.userId, TokenType.ACCESS),
      generateJwtToken(user.userId, TokenType.REFRESH),
    ]);

    return response
      .cookie('refresh', refreshToken.token, {
        maxAge: refreshToken.expiration,
      })
      .send({ accessToken, expiration, user });
  }

  response.status(StatusCodes.BAD_REQUEST).send('Incorrect password');
}

export async function logoutUser(request: Request, response: Response<any, AuthorizedLocals>) {
  const accessToken = request.header('Authorization')?.split(' ')[1];
  const refreshToken = request.headers.cookie?.split('=')?.[1];

  response.clearCookie('refresh');

  if (refreshToken) await addTokenToDenylist(refreshToken);
  if (accessToken) await addTokenToDenylist(accessToken);

  response.sendStatus(StatusCodes.NO_CONTENT);
}

/**
 * Got an access token? Go ahead, but it mustn't be the one you've logged out with or that's expired (e.g. 2 hours).
 * If it's expired, we'll replace it, but only if your refresh token is present and hasn't expired.
 *
 * And, your refresh token? We'll replace that, too, if it hasn't expired and its lifetime has neared its end by a percentage threshold (e.g. 80% of 14 days).
 * Otherwise, you'll be considered logged out, i.e., unauthorized.
 *
 * That way, the frontend needn't worry about implementing interceptors or middlewares for every API request.
 */
export async function validateAuthorizationAndRefresh(
  request: Request,
  response: Response<ErrorResponse, AuthorizedLocals>,
  next: NextFunction,
): Promise<any> {
  const accessToken = request.header('Authorization')?.split(' ')[1];

  if (!accessToken) {
    return response
      .status(StatusCodes.UNAUTHORIZED)
      .send('Missing Authorization header with Bearer schema');
  }

  const refreshToken = request.headers.cookie?.split('=')?.[1];

  function handleMissingAttributes(iat: number | undefined, id: any) {
    const missingAttributes = [iat && 'iat', id && 'id'].map((x) => x);

    console.warn(`${getLoggingPrefix()} A JwtPayload is missing attributes: ${missingAttributes}`);
  }

  try {
    if (await isTokenOnDenylist(accessToken)) throw 'Ignored';

    const { iat, id } = await getJwtTokenPayload(accessToken, TokenType.ACCESS);

    if (iat == null || id == null) {
      handleMissingAttributes(iat, id);
      return response.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    if (!(await getRedis().sIsMember(REDIS_USER_IDS, id.toString())))
      return response.status(StatusCodes.UNAUTHORIZED).send("You don't exist");

    response.locals.userId = id;
  } catch (ignored) {
    try {
      if (!refreshToken || (await isTokenOnDenylist(refreshToken)))
        return response.sendStatus(StatusCodes.UNAUTHORIZED);

      const { iat, id }: { iat?: number; id?: number } = await getJwtTokenPayload(
        refreshToken,
        TokenType.REFRESH,
      );

      if (iat == null || id == null) {
        handleMissingAttributes(iat, id);
        return response.sendStatus(StatusCodes.UNAUTHORIZED);
      }

      if (!(await getRedis().sIsMember(REDIS_USER_IDS, id.toString())))
        return response.status(StatusCodes.UNAUTHORIZED).send("You don't exist");

      const accessTokenPromise = generateJwtToken(id, TokenType.ACCESS);

      // In the meantime, let's await something else...
      if (isEligibleForRefresh(iat)) {
        const [_, generatedRefreshToken] = await Promise.all([
          addTokenToDenylist(refreshToken),
          generateJwtToken(id, TokenType.REFRESH),
        ]);

        response.cookie('refresh', generatedRefreshToken.token, {
          maxAge: generatedRefreshToken.expiration,
        });
      }

      const { token } = await accessTokenPromise;

      response.setHeader('Authorization', `Bearer ${token}`);
      response.locals.userId = id;
    } catch (ignored2) {
      return response.sendStatus(StatusCodes.UNAUTHORIZED);
    }
  }

  next();
}
