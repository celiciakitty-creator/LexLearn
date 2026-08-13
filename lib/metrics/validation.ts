import type {
  MetricsEventRequest,
  QualifyingMetricsEvent,
} from "@/lib/metrics/types";
import { QUALIFYING_METRICS_EVENTS } from "@/lib/metrics/types";

function isPlainMetadataValue(
  value: unknown
): value is string | number | boolean | null {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

export function validateMetricsEventBody(
  body: unknown
): { ok: true; data: MetricsEventRequest } | { ok: false } {
  if (!body || typeof body !== "object") {
    return { ok: false };
  }

  const record = body as Record<string, unknown>;
  const event = record.event;

  if (
    typeof event !== "string" ||
    !QUALIFYING_METRICS_EVENTS.includes(event as QualifyingMetricsEvent)
  ) {
    return { ok: false };
  }

  let metadata: MetricsEventRequest["metadata"];
  if (record.metadata !== undefined) {
    if (!record.metadata || typeof record.metadata !== "object") {
      return { ok: false };
    }
    metadata = {};
    for (const [key, value] of Object.entries(
      record.metadata as Record<string, unknown>
    )) {
      if (!isPlainMetadataValue(value)) {
        return { ok: false };
      }
      metadata[key] = value;
    }
  }

  return {
    ok: true,
    data: {
      event: event as QualifyingMetricsEvent,
      metadata,
    },
  };
}
