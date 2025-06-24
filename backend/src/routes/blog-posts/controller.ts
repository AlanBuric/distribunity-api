import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import getDatabase from '../../services/database.js';

export async function searchBlogPosts(request: Request, response: Response) {
  const { query } = matchedData<{ query: string }>(request);
  const result = await getDatabase().query(
    `
    SELECT 
      id, title, created_at,
      ts_headline('english', content, websearch_to_tsquery('english', $1), 
        'StartSel=<mark>, StopSel=</mark>, MaxWords=10, MaxFragments=3'
      ) as snippet
    FROM blog_posts 
    WHERE to_tsvector('english', title || ' ' || content) @@ websearch_to_tsquery('english', $1)
      AND status = 'published'
    ORDER BY ts_rank_cd(to_tsvector('english', title || ' ' || content), websearch_to_tsquery('english', $1)) DESC
  `,
    [query],
  );

  response.json(result.rows);
}
