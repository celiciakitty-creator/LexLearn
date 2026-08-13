import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { getMetricsConfig } from "@/lib/metrics/config";
import {
  applyMetricsCookies,
  METRICS_SID_COOKIE,
  METRICS_UID_COOKIE,
} from "@/lib/metrics/cookies";
import { forwardMetricsEvent } from "@/lib/metrics/upstream";
import type { MetricsEventResponse } from "@/lib/metrics/types";
import { validateMetricsEventBody } from "@/lib/metrics/validation";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false } satisfies MetricsEventResponse,
      { status: 400 }
    );
  }

  const parsed = validateMetricsEventBody(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false } satisfies MetricsEventResponse,
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const existingUid = cookieStore.get(METRICS_UID_COOKIE)?.value;
  const existingSid = cookieStore.get(METRICS_SID_COOKIE)?.value;
  const uid = existingUid ?? randomUUID();
  const sid = existingSid ?? randomUUID();

  const config = getMetricsConfig();
  let tracked = false;

  if (config) {
    const result = await forwardMetricsEvent({
      config,
      event: parsed.data.event,
      userId: uid,
      sessionId: sid,
      metadata: parsed.data.metadata,
    });
    tracked = result.ok;
  } else {
    console.warn("[metrics] HULT metrics env vars not configured; event skipped");
  }

  const response = NextResponse.json(
    { ok: true, tracked } satisfies MetricsEventResponse,
    { status: 202 }
  );

  applyMetricsCookies(response, uid, sid, {
    setUid: !existingUid,
    setSid: !existingSid,
  });

  return response;
}
