import {
  CLARITY_RATINGS,
  FEEDBACK_ACTIVITIES,
  WOULD_USE_AGAIN,
  type ClarityRating,
  type FeedbackActivity,
  type FeedbackSubmission,
  type WouldUseAgain,
} from "@/lib/feedback/types";

export type FeedbackValidationResult =
  | { valid: true; data: FeedbackSubmission }
  | { valid: false; errors: Record<string, string> };

function isFeedbackActivity(value: unknown): value is FeedbackActivity {
  return (
    typeof value === "string" &&
    (FEEDBACK_ACTIVITIES as readonly string[]).includes(value)
  );
}

function isClarityRating(value: unknown): value is ClarityRating {
  return (
    typeof value === "string" &&
    (CLARITY_RATINGS as readonly string[]).includes(value)
  );
}

function isWouldUseAgain(value: unknown): value is WouldUseAgain {
  return (
    typeof value === "string" &&
    (WOULD_USE_AGAIN as readonly string[]).includes(value)
  );
}

function isOverallRating(value: unknown): value is 1 | 2 | 3 | 4 | 5 {
  return typeof value === "number" && value >= 1 && value <= 5;
}

export function validateFeedbackSubmission(
  body: unknown
): FeedbackValidationResult {
  const errors: Record<string, string> = {};

  if (!body || typeof body !== "object") {
    return { valid: false, errors: { form: "Invalid submission payload." } };
  }

  const raw = body as Record<string, unknown>;

  const activities = Array.isArray(raw.activities)
    ? raw.activities.filter(isFeedbackActivity)
    : [];

  if (activities.length === 0) {
    errors.activities = "Select at least one thing you tried.";
  }

  if (!isClarityRating(raw.clarity)) {
    errors.clarity = "Choose whether LexLearn made the topic easier to understand.";
  }

  if (!isOverallRating(raw.overallRating)) {
    errors.overallRating = "Select an overall star rating.";
  }

  if (!isWouldUseAgain(raw.wouldUseAgain)) {
    errors.wouldUseAgain = "Choose whether you would use LexLearn again.";
  }

  let improvement: string | undefined;
  if (raw.improvement !== undefined && raw.improvement !== null) {
    if (typeof raw.improvement !== "string") {
      errors.improvement = "Improvement feedback must be text.";
    } else {
      const trimmed = raw.improvement.trim();
      if (trimmed.length > 2000) {
        errors.improvement = "Keep your suggestion under 2,000 characters.";
      } else if (trimmed.length > 0) {
        improvement = trimmed;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      activities,
      clarity: raw.clarity as ClarityRating,
      overallRating: raw.overallRating as 1 | 2 | 3 | 4 | 5,
      wouldUseAgain: raw.wouldUseAgain as WouldUseAgain,
      improvement,
    },
  };
}
