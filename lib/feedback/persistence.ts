import { randomUUID } from "crypto";

import { getFeedbackSupabase } from "@/lib/feedback/supabase-server";
import type { FeedbackSubmission } from "@/lib/feedback/types";

export type FeedbackPersistenceResult =
  | { status: "stored"; id: string }
  | { status: "pending"; reason: string };

function feedbackSource(): string {
  return process.env.FEEDBACK_SOURCE?.trim() || "lexlearn";
}

async function persistFeedbackSupabase(
  submission: FeedbackSubmission
): Promise<FeedbackPersistenceResult> {
  const supabase = getFeedbackSupabase();
  if (!supabase) {
    return {
      status: "pending",
      reason:
        "Supabase credentials missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const id = randomUUID();

  const { error } = await supabase.from("pilot_feedback").insert({
    id,
    activities: submission.activities,
    clarity: submission.clarity,
    overall_rating: submission.overallRating,
    would_use_again: submission.wouldUseAgain,
    improvement: submission.improvement ?? null,
    source: feedbackSource(),
  });

  if (error) {
    console.error("[lexlearn:feedback] Supabase insert failed:", error.message);
    return {
      status: "pending",
      reason: "Feedback could not be saved. Please try again later.",
    };
  }

  return { status: "stored", id };
}

/**
 * Server-side persistence for pilot feedback.
 */
export async function persistFeedback(
  submission: FeedbackSubmission
): Promise<FeedbackPersistenceResult> {
  const backend = process.env.FEEDBACK_PERSISTENCE_BACKEND?.trim();

  if (!backend) {
    return {
      status: "pending",
      reason:
        "No persistence backend configured. Set FEEDBACK_PERSISTENCE_BACKEND after choosing storage.",
    };
  }

  switch (backend) {
    case "supabase":
      return persistFeedbackSupabase(submission);
    default:
      return {
        status: "pending",
        reason: `Persistence backend "${backend}" is not implemented yet.`,
      };
  }
}

export function logFeedbackForDevelopment(
  submission: FeedbackSubmission
): void {
  if (process.env.NODE_ENV !== "production") {
    console.info("[lexlearn:feedback] validated submission:", {
      activities: submission.activities,
      clarity: submission.clarity,
      overallRating: submission.overallRating,
      wouldUseAgain: submission.wouldUseAgain,
      hasImprovement: Boolean(submission.improvement),
      backend: process.env.FEEDBACK_PERSISTENCE_BACKEND?.trim() || "none",
    });
  }
}
