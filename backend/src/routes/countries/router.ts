import { Router } from 'express';
import { query } from 'express-validator';
import { handleValidationResults } from '../middleware/validation.js';
import { getFilteredCountries } from './controller.js';

const CountryRouter = Router().get(
  '',
  query('filter').optional().isString().trim().withMessage('Filter must be a string').default(''),
  handleValidationResults,
  getFilteredCountries,
);

export default CountryRouter;
