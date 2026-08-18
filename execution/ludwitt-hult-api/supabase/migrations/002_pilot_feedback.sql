-- LexLearn pilot feedback (separate from Week 5 metrics events)
-- Service-role access only; no public RLS policies.

CREATE TABLE IF NOT EXISTS pilot_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activities TEXT[] NOT NULL,
  clarity TEXT NOT NULL,
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  would_use_again TEXT NOT NULL,
  improvement TEXT,
  source TEXT NOT NULL DEFAULT 'lexlearn',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pilot_feedback_created_at
  ON pilot_feedback (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pilot_feedback_source
  ON pilot_feedback (source);

ALTER TABLE pilot_feedback ENABLE ROW LEVEL SECURITY;
