import { Router } from 'express';
import { searchBlogPosts } from './controller.js';
import { param } from 'express-validator';
import type { MinMaxOptions } from 'express-validator/lib/options.js';

const QUERY_LENGTH_LIMIT: MinMaxOptions = { min: 1, max: 64 };

const BlogPostRouter = Router().get(
  '/search',
  param('query')
    .isString()
    .withMessage('Query must be a string')
    .trim()
    .isLength(QUERY_LENGTH_LIMIT)
    .withMessage(
      `Query length must be between ${QUERY_LENGTH_LIMIT.min} and ${QUERY_LENGTH_LIMIT.max} characters`,
    ),
  searchBlogPosts,
);

export default BlogPostRouter;
