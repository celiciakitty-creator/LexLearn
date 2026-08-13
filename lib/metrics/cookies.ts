import type { NextResponse } from "next/server";

import {
  METRICS_SID_COOKIE,
  METRICS_SID_MAX_AGE,
  METRICS_UID_COOKIE,
  METRICS_UID_MAX_AGE,
} from "@/lib/metrics/types";

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function baseCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction(),
    path: "/",
  };
}

export function applyMetricsCookies(
  response: NextResponse,
  uid: string,
  sid: string,
  options: { setUid: boolean; setSid: boolean }
): void {
  const base = baseCookieOptions();
  if (options.setUid) {
    response.cookies.set(METRICS_UID_COOKIE, uid, {
      ...base,
      maxAge: METRICS_UID_MAX_AGE,
    });
  }
  if (options.setSid) {
    response.cookies.set(METRICS_SID_COOKIE, sid, {
      ...base,
      maxAge: METRICS_SID_MAX_AGE,
    });
  }
}

export { METRICS_UID_COOKIE, METRICS_SID_COOKIE };
