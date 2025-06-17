import { Router } from 'express';
import { param } from 'express-validator';
import { handleValidationResults } from '../middleware/validation.js';
import { getFilteredCountries } from './controller.js';

const CountryRouter = Router().get(
  '',
  param('filter').optional().isString().withMessage('Filter must be a string').default(''),
  handleValidationResults,
  getFilteredCountries,
);

export default CountryRouter;
