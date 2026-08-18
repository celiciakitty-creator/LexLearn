import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

import { requireSupabaseEnv } from "./feedback-env.mjs";

const TEST_SOURCE = "TEST_DATA";
const TEST_ID = randomUUID();

const { url, key } = requireSupabaseEnv();
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log("Inserting synthetic TEST_DATA feedback row…");

const { error: insertError } = await supabase.from("pilot_feedback").insert({
  id: TEST_ID,
  activities: ["lesson", "quiz"],
  clarity: "yes-definitely",
  overall_rating: 5,
  would_use_again: "yes",
  improvement: "SYNTHETIC TEST ROW — safe to delete",
  source: TEST_SOURCE,
});

if (insertError) {
  console.error("TEST insert failed:", insertError.message);
  process.exit(1);
}

const { data: row, error: readError } = await supabase
  .from("pilot_feedback")
  .select("id, source")
  .eq("id", TEST_ID)
  .maybeSingle();

if (readError || !row) {
  console.error("TEST read-back failed");
  process.exit(1);
}

console.log("TEST row verified:", { id: row.id, source: row.source });

console.log("Removing TEST_DATA row…");

const { error: deleteError } = await supabase
  .from("pilot_feedback")
  .delete()
  .eq("id", TEST_ID);

if (deleteError) {
  console.error("TEST delete failed:", deleteError.message);
  process.exit(1);
}

const { count, error: countError } = await supabase
  .from("pilot_feedback")
  .select("*", { count: "exact", head: true })
  .eq("source", TEST_SOURCE);

if (countError) {
  console.error("TEST cleanup verify failed:", countError.message);
  process.exit(1);
}

if (count !== 0) {
  console.error("TEST cleanup incomplete — TEST_DATA rows remain:", count);
  process.exit(1);
}

console.log("Feedback persistence test passed (TEST_DATA removed).");
