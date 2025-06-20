import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleValidationResults } from '../middleware/validation.js';
import { getFilteredCountries, addEmailToNewsletter } from './controller.js';

const MiscellaneousRouter = Router()
  .get(
    '/countries',
    param('filter').optional().isString().withMessage('Filter must be a string').default(''),
    handleValidationResults,
    getFilteredCountries,
  )
  .post(
    '/newsletter',
    body('email').isEmail().withMessage('Invalid e-mail'),
    handleValidationResults,
    addEmailToNewsletter,
  );

export default MiscellaneousRouter;
