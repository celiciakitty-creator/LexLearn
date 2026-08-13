import type { QualifyingMetricsEvent } from "@/lib/metrics/types";

/**
 * Fire-and-forget client call to the server metrics proxy.
 * Never throws; failures are silent in the browser.
 */
export function trackMetricsEvent(
  event: QualifyingMetricsEvent,
  metadata?: Record<string, string | number | boolean | null>
): void {
  void fetch("/api/metrics/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ event, metadata }),
  }).catch(() => {
    // Metrics must never interrupt learning.
  });
}

const DEDUPE_PREFIX = "lexlearn_metrics:";

export function hasMetricsEventFired(
  event: QualifyingMetricsEvent,
  moduleId: string
): boolean {
  if (typeof sessionStorage === "undefined") {
    return false;
  }
  return (
    sessionStorage.getItem(`${DEDUPE_PREFIX}${event}:${moduleId}`) === "1"
  );
}

export function markMetricsEventFired(
  event: QualifyingMetricsEvent,
  moduleId: string
): void {
  if (typeof sessionStorage === "undefined") {
    return;
  }
  sessionStorage.setItem(`${DEDUPE_PREFIX}${event}:${moduleId}`, "1");
}
