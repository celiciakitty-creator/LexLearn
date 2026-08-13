import type { FeedbackSubmission } from "@/lib/feedback/types";

export type FeedbackPersistenceResult =
  | { status: "stored"; id: string }
  | { status: "pending"; reason: string };

/**
 * Server-side persistence abstraction for pilot feedback.
 * Connect a backend here after the Week 5 reference API is reviewed.
 */
export async function persistFeedback(
  submission: FeedbackSubmission
): Promise<FeedbackPersistenceResult> {
  void submission;
  const backend = process.env.FEEDBACK_PERSISTENCE_BACKEND?.trim();

  if (!backend) {
    return {
      status: "pending",
      reason:
        "No persistence backend configured. Set FEEDBACK_PERSISTENCE_BACKEND after choosing storage.",
    };
  }

  switch (backend) {
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
    console.info("[lexlearn:feedback] validated submission (not stored):", {
      activities: submission.activities,
      clarity: submission.clarity,
      overallRating: submission.overallRating,
      wouldUseAgain: submission.wouldUseAgain,
      hasImprovement: Boolean(submission.improvement),
    });
  }
}
