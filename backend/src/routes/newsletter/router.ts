import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleValidationResults } from '../middleware/validation.js';
import { addEmailToNewsletter } from './controller.js';

const NewsletterRouter = Router().post(
  '/newsletter',
  body('email').trim().isEmail().withMessage('Invalid e-mail'),
  handleValidationResults,
  addEmailToNewsletter,
);

export default NewsletterRouter;
