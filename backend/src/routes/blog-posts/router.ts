import { Router } from 'express';
import {
  createBlogPost,
  requireApplicationAdmin,
  searchBlogPostsAsAdmin,
  searchPublishedBlogPosts,
  updateBlogPost,
} from './controller.js';
import { body, param, query } from 'express-validator';
import type { MinMaxOptions } from 'express-validator/lib/options.js';
import { handleValidationResults } from '../middleware/validation.js';

const FILTER_LENGTH_LIMIT: MinMaxOptions = { min: 0, max: 64 };
const PAGE_LIMIT_LIMIT: MinMaxOptions = { min: 1, max: 100 };

const queryValidatorChain = [
  query('filter')
    .optional()
    .isString()
    .withMessage('Filter term must be a string')
    .trim()
    .isLength(FILTER_LENGTH_LIMIT)
    .withMessage(
      `Filter length must be between ${FILTER_LENGTH_LIMIT.min} and ${FILTER_LENGTH_LIMIT.max} characters`,
    ),
  query('page').isInt({ min: 0 }).withMessage('Page index must be a positive integer').toInt(),
  query('limit')
    .isInt({ min: 1, max: 100 })
    .withMessage(
      `Page limit must be an integer between ${PAGE_LIMIT_LIMIT.min} and ${PAGE_LIMIT_LIMIT.max}`,
    )
    .toInt(),
];

function createBlogPostValidatorChain() {
  return [
    body('title')
      .isString()
      .withMessage('Missing title string')
      .bail()
      .isLength({ min: 1, max: 128 })
      .withMessage('Invalid title length'),
    body('description')
      .isString()
      .withMessage('Missing description string')
      .bail()
      .isLength({ min: 1, max: 256 })
      .withMessage('Invalid description length'),
    body('content')
      .isString()
      .withMessage('Missing content text')
      .bail()
      .isLength({ min: 1, max: 5072 })
      .withMessage('Invalid content length'),
    body('showAuthor').isBoolean().withMessage('Missing showAuthor boolean').bail().toBoolean(),
    body('isDraft').isBoolean().withMessage('Missing isDraft boolean').bail().toBoolean(),
  ];
}

const BlogPostRouter = Router()
  .get('/search', queryValidatorChain, handleValidationResults, searchPublishedBlogPosts)
  .get(
    '/search/admin',
    requireApplicationAdmin,
    queryValidatorChain,
    handleValidationResults,
    searchBlogPostsAsAdmin,
  )
  .get(
    ':blogPostId',
    param('blogPostId').isInt().withMessage('Invalid or missing blog post ID').toInt(),
    handleValidationResults,
  )
  .post(
    '',
    requireApplicationAdmin,
    createBlogPostValidatorChain(),
    handleValidationResults,
    createBlogPost,
  )
  .patch(
    ':blogPostId',
    requireApplicationAdmin,
    param('blogPostId').isInt().withMessage('Invalid or missing blog post ID').toInt(),
    createBlogPostValidatorChain().map((validator) => validator.optional()),
    handleValidationResults,
    updateBlogPost,
  );

export default BlogPostRouter;
