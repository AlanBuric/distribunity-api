import type { Request, Response } from 'express';
import { Router } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import type { UserRegistrationRequest } from '../../types/data-transfer-objects.js';
import { handleValidationResults } from '../middleware/validation.js';
import { logInUser, logoutUser, validateAuthorizationAndRefresh } from './controller.js';
import { registerUser } from '../user/service.js';
import { validatePassword } from '../user/controller.js';

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
    body('password').exists().withMessage(MISSING_PASSWORD).custom(validatePassword),
    /*.withMessage(
        'A strong password needs to be at least 8 characters long, at least 1 lowercase and uppercase character, at least 1 number, and at least 1 symbol',
      )*/ handleValidationResults,
    (
      request: Request<Record<string, never>, Record<string, never>, UserRegistrationRequest>,
      response: Response,
    ): Promise<any> =>
      registerUser(request.body).then((user) => response.status(StatusCodes.CREATED).send(user)),
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
    logInUser,
  )
  .delete('/logout', logoutUser)
  .use(validateAuthorizationAndRefresh);

export default SessionRouter;
