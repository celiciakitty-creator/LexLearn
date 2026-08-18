import { createClient } from "@supabase/supabase-js";

import { requireSupabaseEnv } from "./feedback-env.mjs";

const { url, key } = requireSupabaseEnv();

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error, count } = await supabase
  .from("pilot_feedback")
  .select("clarity, would_use_again, overall_rating, source", { count: "exact" })
  .neq("source", "TEST_DATA");

if (error) {
  console.error("Feedback stats query failed:", error.message);
  process.exit(1);
}

const rows = data ?? [];
const total = count ?? rows.length;

let ratingSum = 0;
const clarityCounts = {};
const wouldUseAgainCounts = {};

for (const row of rows) {
  ratingSum += row.overall_rating;
  clarityCounts[row.clarity] = (clarityCounts[row.clarity] ?? 0) + 1;
  wouldUseAgainCounts[row.would_use_again] =
    (wouldUseAgainCounts[row.would_use_again] ?? 0) + 1;
}

const averageOverallRating =
  total > 0 ? Number((ratingSum / total).toFixed(2)) : null;

console.log(
  JSON.stringify(
    {
      total_responses: total,
      average_overall_rating: averageOverallRating,
      clarity_distribution: clarityCounts,
      would_use_again_distribution: wouldUseAgainCounts,
      note: "Aggregates only — individual responses and improvement text are not shown.",
    },
    null,
    2
  )
);
