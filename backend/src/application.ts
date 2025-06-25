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
import helmet from 'helmet';
import type { createClient } from '@redis/client';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

function getRedisRateLimiter(redisClient?: ReturnType<typeof createClient>) {
  if (redisClient) {
    return [
      rateLimit({
        windowMs: 4 * 60 * 1000,
        max: 50,
        standardHeaders: true,
        legacyHeaders: false,
        store: new RedisStore({
          sendCommand: (...args: string[]) => redisClient.sendCommand(args),
        }),
      }),
    ];
  }

  return [];
}

export default function createApplication(redisClient?: ReturnType<typeof createClient>) {
  return express()
    .get('/health', handleHealthcheck)
    .use(
      '/api/v1',
      ...getRedisRateLimiter(redisClient),
      helmet(),
      cors({ allowedHeaders: ['Content-Type', 'Authorization'] }),
      json(),
      SessionRouter,
      Router()
        .use('/users', UserRouter)
        .use('/organizations', OrganizationRouter)
        .use('/blog-posts', BlogPostRouter)
        .use('/countries', CountryRouter)
        .use('/newsletter', NewsletterRouter)
        .use(handleError),
    );
}
