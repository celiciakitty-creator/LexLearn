-- Ludwitt/Hult reference API — initial Postgres schema
-- Run in Supabase SQL Editor or via Supabase CLI: supabase db push

CREATE TABLE IF NOT EXISTS developers (
  id TEXT PRIMARY KEY,
  handle TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  sandbox BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS apps (
  app_id TEXT PRIMARY KEY,
  developer_id TEXT NOT NULL REFERENCES developers (id),
  api_key TEXT NOT NULL,
  jwt_secret TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  topic TEXT NOT NULL,
  launch_url TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  icon_url TEXT,
  student_handle TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  app_id TEXT NOT NULL REFERENCES apps (app_id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  metadata JSONB,
  ts BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_app_id ON events (app_id);
CREATE INDEX IF NOT EXISTS idx_events_app_user ON events (app_id, user_id);
CREATE INDEX IF NOT EXISTS idx_events_app_qualifying ON events (app_id, event)
  WHERE event IN ('lesson_started', 'lesson_completed', 'quiz_submitted');

CREATE TABLE IF NOT EXISTS blocked_user_ids (
  user_id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS enabled with no public policies; reference API uses service_role server-side only.
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_user_ids ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_app_metrics(p_app_id TEXT)
RETURNS JSON
LANGUAGE sql
STABLE
AS $$
  SELECT json_build_object(
    'unique_users', COALESCE((
      SELECT COUNT(DISTINCT user_id)::bigint
      FROM events
      WHERE app_id = p_app_id
    ), 0),
    'qualified_users', COALESCE((
      SELECT COUNT(DISTINCT user_id)::bigint
      FROM events
      WHERE app_id = p_app_id
        AND event IN ('lesson_started', 'lesson_completed', 'quiz_submitted')
    ), 0)
  );
$$;
