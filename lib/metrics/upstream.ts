import type { MetricsConfig } from "@/lib/metrics/config";
import type { QualifyingMetricsEvent } from "@/lib/metrics/types";

type ForwardInput = {
  config: MetricsConfig;
  event: QualifyingMetricsEvent;
  userId: string;
  sessionId: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export async function forwardMetricsEvent(
  input: ForwardInput
): Promise<{ ok: boolean; counted?: boolean }> {
  const { config, event, userId, sessionId, metadata } = input;
  const url = `${config.baseUrl}/v1/apps/${config.appId}/events`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.devApiKey}`,
      },
      body: JSON.stringify({
        event,
        user_id: userId,
        session_id: sessionId,
        metadata: metadata ?? undefined,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[metrics] upstream rejected event", {
        status: response.status,
        event,
      });
      return { ok: false };
    }

    let counted: boolean | undefined;
    try {
      const body = (await response.json()) as { counted?: boolean };
      counted = body.counted;
    } catch {
      counted = undefined;
    }

    return { ok: true, counted };
  } catch (error) {
    console.error("[metrics] upstream unavailable", {
      event,
      message: error instanceof Error ? error.message : "unknown",
    });
    return { ok: false };
  }
}

export async function fetchMetricsSnapshot(
  config: MetricsConfig
): Promise<{ unique_users: number; qualified_users: number } | null> {
  const url = `${config.baseUrl}/v1/apps/${config.appId}/metrics`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${config.devApiKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[metrics] metrics fetch failed", { status: response.status });
      return null;
    }

    return (await response.json()) as {
      unique_users: number;
      qualified_users: number;
    };
  } catch (error) {
    console.error("[metrics] metrics fetch error", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return null;
  }
}
