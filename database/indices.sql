CREATE INDEX IF NOT EXISTS user_email_idx ON "user"(email);
CREATE INDEX IF NOT EXISTS item_name_idx ON item(name);
CREATE INDEX IF NOT EXISTS item_attributes_idx ON item USING GIN (attributes);
CREATE INDEX IF NOT EXISTS country_name_lower_idx ON country (LOWER(country_name));
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts 
  USING GIN (to_tsvector('english', title || ' ' || content));