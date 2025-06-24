import 'dotenv/config';
import cors from 'cors';
import express, { json, Router } from 'express';
import handleError from './routes/middleware/error-handler.js';
import SessionRouter from './routes/session/router.js';
import OrganizationRouter from './routes/organization/router.js';
import UserRouter from './routes/user/router.js';
import NewsletterRouter from './routes/newsletter/router.js';
import BlogPostRouter from './routes/blog-posts/router.js';
import CountryRouter from './routes/countries/router.js';
import handleHealthcheck from './routes/healthcheck.js';

export default function createApplication() {
  return express()
    .get('/health', handleHealthcheck)
    .use(
      '/api/v1',
      Router()
        .use(cors({ allowedHeaders: ['Content-Type', 'Authorization'] }), json(), SessionRouter)
        .use('/users', UserRouter)
        .use('/organizations', OrganizationRouter)
        .use('/blog-posts', BlogPostRouter)
        .use('/countries', CountryRouter)
        .use('/newsletter', NewsletterRouter)
        .use(handleError),
    );
}
