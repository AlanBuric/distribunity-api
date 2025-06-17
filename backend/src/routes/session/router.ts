import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { body, matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import type {
  AuthorizedLocals,
  ErrorResponse,
  UserLoginResponse,
  UserRegistrationRequest,
} from '../../types/data-transfer-objects.js';
import { handleValidationResults } from '../middleware/validation.js';
import * as UserService from '../user/service.js';
import { camelCaseify } from '../../utils/database.js';
import type { User } from '../../types/database-types.js';
import {
  verifyPassword,
  generateJwtToken,
  TokenType,
  getJwtTokenPayload,
  addTokenToDenylist,
  isTokenOnDenylist,
  isEligibleForRefresh,
} from './service.js';
import getDatabase from '../../services/database.js';
import getLoggingPrefix from '../../utils/logging.js';
import { logoutUser } from './controller.js';
import getRedis from '../../services/redis.js';
import { REDIS_USER_IDS } from '../../utils/constants.js';

type UserLoginRequest = {
  email: string;
  password: string;
};

const INVALID_EMAIL = 'Invalid e-mail format';
const MISSING_PASSWORD = 'Missing password field';

const SessionRouter = Router()
  .post(
    '/register',
    body('firstName')
      .trim()
      .isLength({ min: 1 })
      .withMessage('First name needs to be at least 1 character long')
      .isAlpha(undefined, { ignore: ["'", '-'] })
      .withMessage('First name needs to consist only of letters'),
    body('lastName')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Last name needs to be at least 1 character long')
      .isAlpha(undefined, { ignore: ["'", '-'] })
      .withMessage('Last name needs to consist only of letters'),
    body('email').isEmail().toLowerCase().withMessage(INVALID_EMAIL),
    body('password')
      .exists()
      .withMessage(MISSING_PASSWORD)
      .isStrongPassword()
      .withMessage(
        'A strong password needs to be at least 8 characters long, at least 1 lowercase and uppercase character, at least 1 number, and at least 1 symbol',
      ),
    handleValidationResults,
    (
      request: Request<Record<string, never>, Record<string, never>, UserRegistrationRequest>,
      response: Response,
    ): Promise<any> =>
      UserService.registerUser(request.body).then((user) =>
        response.status(StatusCodes.CREATED).send(user),
      ),
  )
  .post(
    '/login',
    body('email')
      .exists()
      .withMessage('Missing e-mail')
      .isEmail()
      .withMessage(INVALID_EMAIL)
      .bail()
      .toLowerCase(),
    body('password').notEmpty().withMessage(MISSING_PASSWORD),
    handleValidationResults,
    async (
      request: Request<
        Record<string, never>,
        Record<string, never>,
        UserLoginRequest,
        Record<string, never>
      >,
      response: Response<UserLoginResponse | ErrorResponse>,
    ): Promise<any> => {
      const { email, password } = matchedData(request);

      const {
        rows: [dbFullUser],
        rowCount,
      } = await getDatabase().query('SELECT * FROM "user" WHERE email = $1', [email]);

      if (!rowCount) return response.status(StatusCodes.NOT_FOUND).send('User not found');

      const fullUser = camelCaseify<User>(dbFullUser);

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
    },
  )
  .delete('/logout', logoutUser)
  /**
   * Got an access token? Go ahead, but it mustn't be the one you've logged out with or that's expired (e.g. 2 hours).
   * If it's expired, we'll replace it, but only if your refresh token is present and hasn't expired.
   *
   * And, your refresh token? We'll replace that, too, if it hasn't expired and its lifetime has neared its end by a percentage threshold (e.g. 80% of 14 days).
   * Otherwise, you'll be considered logged out, i.e., unauthorized.
   *
   * That way, the frontend needn't worry about implementing interceptors or middlewares for every API request.
   */
  .use(
    async (
      request: Request,
      response: Response<ErrorResponse, AuthorizedLocals>,
      next: NextFunction,
    ): Promise<any> => {
      const accessToken = request.header('Authorization')?.split(' ')[1];

      if (!accessToken) {
        return response
          .status(StatusCodes.UNAUTHORIZED)
          .send('Missing Authorization header with Bearer schema');
      }

      const refreshToken = request.headers.cookie?.split('=')?.[1];

      function handleMissingAttributes(iat: number | undefined, id: any) {
        const missingAttributes = [iat && 'iat', id && 'id'].map((x) => x);

        console.warn(
          `${getLoggingPrefix} A JwtPayload is missing attributes: ${missingAttributes}`,
        );
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
    },
  );

export default SessionRouter;
