import { Request, Response, type NextFunction } from 'express';
import { matchedData } from 'express-validator';
import getDatabase from '../../services/database.js';
import type {
  AuthorizedLocals,
  BlogPostCreate,
  BlogPostUpdate,
  FullBlogPostPreview,
  PageResponse,
  PublishedBlogPostPreview,
} from '../../types/data-transfer-objects.js';
import { StatusCodes } from 'http-status-codes';
import { camelCaseify, getSqlPatchColumns } from '../../utils/database.js';

export function requireApplicationAdmin(
  _request: Request,
  response: Response<AuthorizedLocals>,
  next: NextFunction,
) {
  if (response.locals.userId == 1) return next();

  response.sendStatus(StatusCodes.FORBIDDEN);
}

export async function searchPublishedBlogPosts(
  request: Request,
  response: Response<PageResponse<PublishedBlogPostPreview>>,
) {
  const { limit, page, filter } = matchedData<{ limit: number; page: number; filter?: string }>(
    request,
  );

  const optionalTextFilter = filter
    ? `AND (
        bp.title ILIKE '%' || $3 || '%'
        OR bp.description ILIKE '%' || $3 || '%'
        OR bp.content ILIKE '%' || $3 || '%'
      )`
    : '';

  const countPromise = getDatabase().query(
    `SELECT COUNT(*) AS total
   FROM blog_post bp
   WHERE bp.is_draft IS FALSE
   ${optionalTextFilter.replaceAll('$3', '$1')}`,
    filter ? [filter] : [],
  );

  const args: any[] = [limit, page * limit];

  if (filter) args.push(filter);

  const dataPromise = await getDatabase().query(
    `SELECT
      bp.blog_post_id,
      bp.title,
      bp.description,
      bp.created_at,
      bp.updated_at,
      CASE WHEN bp.show_author THEN 
        CONCAT(u.first_name, ' ', u.last_name) 
      ELSE 
        NULL
      END 
      AS author_name
    FROM blog_post bp
    JOIN "user" u ON bp.user_id = u.user_id
    WHERE bp.is_draft IS TRUE
      ${optionalTextFilter}
    ORDER BY bp.created_at DESC
    LIMIT $1 OFFSET $2;`,
    args,
  );

  const [
    {
      rows: [{ total }],
    },
    dataResult,
  ] = await Promise.all([countPromise, dataPromise]);

  response.json({
    total: Number(total),
    data: dataResult.rows.map(camelCaseify<PublishedBlogPostPreview>),
  });
}

export async function searchBlogPostsAsAdmin(
  request: Request,
  response: Response<PageResponse<FullBlogPostPreview>>,
) {
  const { limit, page, filter } = matchedData<{ limit: number; page: number; filter?: string }>(
    request,
  );

  const optionalTextFilter = filter
    ? `WHERE (
        bp.title ILIKE '%' || $3 || '%'
        OR bp.description ILIKE '%' || $3 || '%'
        OR bp.content ILIKE '%' || $3 || '%'
      )`
    : '';

  const countPromise = getDatabase().query(
    `SELECT COUNT(*) AS total
    FROM blog_post bp
    ${optionalTextFilter.replaceAll('$3', '$1')}`,
    filter ? [filter] : [],
  );

  const args: any[] = [limit, page * limit];

  if (filter) args.push(filter);

  const dataPromise = getDatabase().query(
    `SELECT
      bp.blog_post_id,
      bp.title,
      bp.description,
      bp.created_at,
      bp.updated_at,
      CASE WHEN bp.show_author THEN 
        CONCAT(u.first_name, ' ', u.last_name) 
      ELSE 
        NULL
      END 
      AS author_name
    FROM blog_post bp
    JOIN "user" u ON bp.user_id = u.user_id
    ${optionalTextFilter}
    ORDER BY bp.created_at DESC
    LIMIT $1 OFFSET $2;`,
    args,
  );

  const [
    {
      rows: [{ total }],
    },
    dataResult,
  ] = await Promise.all([countPromise, dataPromise]);

  response.json({
    total: Number(total),
    data: dataResult.rows.map(camelCaseify<FullBlogPostPreview>),
  });
}

export async function getBlogPost(request: Request, response: Response<any, AuthorizedLocals>) {
  const { blogPostId } = matchedData<{ blogPostId: number }>(request);
  const draftFilter = response.locals.userId == 1 ? '' : 'AND bp.is_draft IS NOT TRUE';

  const { rows } = await getDatabase().query(
    `SELECT
      bp.blog_post_id,
      bp.title,
      bp.description,
      bp.created_at,
      bp.updated_at,
      CASE WHEN bp.show_author THEN 
        CONCAT(u.first_name, ' ', u.last_name) 
      ELSE 
        NULL
      END 
      AS author_name
      FROM blog_post bp
      JOIN "user" u ON bp.user_id = u.user_id
      WHERE bp.user_id = $1 ${draftFilter}
      `,
    [blogPostId],
  );

  if (!rows.length) return response.sendStatus(StatusCodes.NOT_FOUND);

  response.send(camelCaseify<FullBlogPostPreview>(rows[0]));
}

export async function createBlogPost(
  request: Request<any, BlogPostCreate>,
  response: Response<any, AuthorizedLocals>,
) {
  const { title, description, content, showAuthor, isDraft } = matchedData<BlogPostCreate>(request);

  await getDatabase().query(
    `INSERT INTO blog_post (title, description, content, user_id, show_author, is_draft) 
    VALUES ($1, $2, $3, $4, $5, $6)`,
    [title, description, content, response.locals.userId, showAuthor, isDraft],
  );

  response.sendStatus(StatusCodes.NO_CONTENT);
}

export async function updateBlogPost(
  request: Request<any, BlogPostUpdate>,
  response: Response<any, AuthorizedLocals>,
) {
  const { title, description, content, showAuthor, isDraft, blogPostId } =
    matchedData<BlogPostUpdate>(request);

  const [set, args] = getSqlPatchColumns(
    [
      ['title', title],
      ['description', description],
      ['content', content],
      ['show_author', showAuthor],
      ['is_draft', isDraft],
    ],
    blogPostId,
  );

  await getDatabase().query(
    `UPDATE blog_post SET ${set} WHERE blog_post_id = $${args.length}`,
    args,
  );

  response.sendStatus(StatusCodes.NO_CONTENT);
}
