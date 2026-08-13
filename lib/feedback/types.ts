export const FEEDBACK_ACTIVITIES = [
  "lesson",
  "quiz",
  "legal-bites",
  "case-spotlight",
  "progress-achievements",
] as const;

export type FeedbackActivity = (typeof FEEDBACK_ACTIVITIES)[number];

export const CLARITY_RATINGS = [
  "yes-definitely",
  "a-little",
  "not-really",
] as const;

export type ClarityRating = (typeof CLARITY_RATINGS)[number];

export const WOULD_USE_AGAIN = ["yes", "maybe", "no"] as const;

export type WouldUseAgain = (typeof WOULD_USE_AGAIN)[number];

export type FeedbackSubmission = {
  activities: FeedbackActivity[];
  clarity: ClarityRating;
  overallRating: 1 | 2 | 3 | 4 | 5;
  wouldUseAgain: WouldUseAgain;
  improvement?: string;
};

export type FeedbackSubmissionPayload = FeedbackSubmission;

export type FeedbackApiSuccess =
  | {
      ok: true;
      stored: false;
      persistence: "pending";
      message: string;
    }
  | {
      ok: true;
      stored: true;
      persistence: "stored";
      id: string;
      message: string;
    };

export type FeedbackApiError = {
  ok: false;
  error: string;
  details?: Record<string, string>;
};

export type FeedbackApiResponse = FeedbackApiSuccess | FeedbackApiError;

export const FEEDBACK_ACTIVITY_LABELS: Record<FeedbackActivity, string> = {
  lesson: "Lesson",
  quiz: "Quiz",
  "legal-bites": "Legal Bites",
  "case-spotlight": "Case Spotlight",
  "progress-achievements": "Progress / Achievements",
};

export const CLARITY_LABELS: Record<ClarityRating, string> = {
  "yes-definitely": "Yes, definitely",
  "a-little": "A little",
  "not-really": "Not really",
};

export const WOULD_USE_AGAIN_LABELS: Record<WouldUseAgain, string> = {
  yes: "Yes",
  maybe: "Maybe",
  no: "No",
};
