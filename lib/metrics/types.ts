export const METRICS_UID_COOKIE = "lexlearn_metrics_uid";
export const METRICS_SID_COOKIE = "lexlearn_metrics_sid";

/** ~1 year */
export const METRICS_UID_MAX_AGE = 60 * 60 * 24 * 365;

/** Session-scoped learning visit (~24h) */
export const METRICS_SID_MAX_AGE = 60 * 60 * 24;

export const QUALIFYING_METRICS_EVENTS = [
  "lesson_started",
  "lesson_completed",
  "quiz_submitted",
] as const;

export type QualifyingMetricsEvent =
  (typeof QUALIFYING_METRICS_EVENTS)[number];

export type MetricsEventRequest = {
  event: QualifyingMetricsEvent;
  metadata?: Record<string, string | number | boolean | null>;
};

export type MetricsEventResponse = {
  ok: boolean;
  tracked?: boolean;
};
