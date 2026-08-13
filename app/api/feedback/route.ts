import { NextResponse, type NextRequest } from "next/server";

import {
  logFeedbackForDevelopment,
  persistFeedback,
} from "@/lib/feedback/persistence";
import type { FeedbackApiResponse } from "@/lib/feedback/types";
import { validateFeedbackSubmission } from "@/lib/feedback/validation";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." } satisfies FeedbackApiResponse,
      { status: 400 }
    );
  }

  const validation = validateFeedbackSubmission(body);

  if (!validation.valid) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        details: validation.errors,
      } satisfies FeedbackApiResponse,
      { status: 400 }
    );
  }

  logFeedbackForDevelopment(validation.data);

  const persistence = await persistFeedback(validation.data);

  if (persistence.status === "stored") {
    return NextResponse.json({
      ok: true,
      stored: true,
      persistence: "stored",
      id: persistence.id,
      message: "Thank you — your feedback has been saved.",
    });
  }

  const response: FeedbackApiResponse = {
    ok: true,
    stored: false,
    persistence: "pending",
    message:
      "Your feedback was validated but is not stored centrally yet. Persistence is pending backend selection after the Week 5 reference API review.",
  };

  return NextResponse.json(response, { status: 202 });
}
