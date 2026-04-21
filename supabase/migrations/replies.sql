-- ─── Premium Community: replies table + helpers ───────────────────────────────
-- Run this in your Supabase SQL editor.

CREATE TABLE IF NOT EXISTS replies (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  comment_id  TEXT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  author_id   TEXT NOT NULL,
  author_name TEXT NOT NULL,
  likes       JSONB NOT NULL DEFAULT '[]'::jsonb,
  like_count  INT  NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS replies_comment_id_idx ON replies(comment_id);

-- RPC helpers used by the client to keep counters consistent.

CREATE OR REPLACE FUNCTION increment_post_count(space_row_id TEXT)
RETURNS VOID AS $$
  UPDATE spaces SET post_count = post_count + 1 WHERE id = space_row_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION decrement_post_count(space_row_id TEXT)
RETURNS VOID AS $$
  UPDATE spaces SET post_count = GREATEST(post_count - 1, 0) WHERE id = space_row_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION increment_comment_count(post_row_id TEXT)
RETURNS VOID AS $$
  UPDATE posts SET comment_count = comment_count + 1 WHERE id = post_row_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION decrement_comment_count(post_row_id TEXT)
RETURNS VOID AS $$
  UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = post_row_id;
$$ LANGUAGE SQL;

-- Recommended Row-Level Security (open read, anyone can write — adapt to your auth):

ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "replies are readable by all"   ON replies FOR SELECT USING (true);
CREATE POLICY "replies can be inserted by all" ON replies FOR INSERT WITH CHECK (true);
CREATE POLICY "replies can be updated by all" ON replies FOR UPDATE USING (true);
CREATE POLICY "replies can be deleted by all" ON replies FOR DELETE USING (true);
