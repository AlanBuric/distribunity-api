import { Router } from 'express';
import { changeSelfUserPassword, deleteSelfUser, editSelfUser, getSelfUser } from './controller.js';
import { handleValidationResults } from '../middleware/validation.js';
import { body } from 'express-validator';
import type { MinMaxOptions } from 'express-validator/lib/options.js';

const NAME_LENGTH_LIMIT: MinMaxOptions = { min: 1, max: 30 };
const SUPPORTED_LANGUAGES = ['en-US', 'hr-HR', 'it-IT'];
const SUPPORTED_THEMES = ['dark', 'light'];

const UserRouter = Router()
  .get('/self', getSelfUser)
  .patch(
    '/self',
    body('firstName')
      .optional()
      .isString()
      .isLength(NAME_LENGTH_LIMIT)
      .withMessage(
        `First name must be between ${NAME_LENGTH_LIMIT.min} and ${NAME_LENGTH_LIMIT.max} characters long`,
      ),
    body('lastName')
      .optional()
      .isString()
      .isLength(NAME_LENGTH_LIMIT)
      .withMessage(
        `Last name must be between ${NAME_LENGTH_LIMIT.min} and ${NAME_LENGTH_LIMIT.max} characters long`,
      ),
    body('language')
      .optional()
      .isString()
      .isIn(SUPPORTED_LANGUAGES)
      .withMessage(`Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`),
    body('theme')
      .optional()
      .isString()
      .isIn(SUPPORTED_THEMES)
      .withMessage(`Theme must be one of: ${SUPPORTED_THEMES.join(', ')}`),
    handleValidationResults,
    editSelfUser,
  )
  .patch('/self/password', changeSelfUserPassword)
  .delete('/self', deleteSelfUser);

export default UserRouter;
