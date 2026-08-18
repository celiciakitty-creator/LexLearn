"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Star } from "lucide-react";

import { MotionWrapper } from "@/components/home/motion-wrapper";
import { SurveyLinkButton } from "@/components/home/survey-link-button";
import { Button } from "@/components/ui/button";
import {
  CLARITY_LABELS,
  CLARITY_RATINGS,
  FEEDBACK_ACTIVITIES,
  FEEDBACK_ACTIVITY_LABELS,
  WOULD_USE_AGAIN,
  WOULD_USE_AGAIN_LABELS,
  type ClarityRating,
  type FeedbackActivity,
  type FeedbackApiResponse,
  type FeedbackSubmission,
  type WouldUseAgain,
} from "@/lib/feedback/types";
import { usePilotJourney } from "@/hooks/use-pilot-journey";
import { cn } from "@/lib/utils";

type FormState = {
  activities: FeedbackActivity[];
  clarity: ClarityRating | "";
  overallRating: number;
  wouldUseAgain: WouldUseAgain | "";
  improvement: string;
};

const INITIAL_FORM: FormState = {
  activities: [],
  clarity: "",
  overallRating: 0,
  wouldUseAgain: "",
  improvement: "",
};

type SubmitStatus = "idle" | "loading" | "pending" | "stored" | "error";

export function FeedbackSection() {
  const { learnComplete, completeFeedback } = usePilotJourney();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const toggleActivity = (activity: FeedbackActivity) => {
    setForm((prev) => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((item) => item !== activity)
        : [...prev.activities, activity],
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.activities;
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setErrors({});
    setStatusMessage("");

    const payload: FeedbackSubmission = {
      activities: form.activities,
      clarity: form.clarity as ClarityRating,
      overallRating: form.overallRating as 1 | 2 | 3 | 4 | 5,
      wouldUseAgain: form.wouldUseAgain as WouldUseAgain,
      improvement: form.improvement.trim() || undefined,
    };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as FeedbackApiResponse;

      if (!data.ok) {
        setStatus("error");
        setErrors(data.details ?? {});
        setStatusMessage(data.error);
        return;
      }

      if (data.stored) {
        setStatus("stored");
        setStatusMessage(data.message);
        setForm(INITIAL_FORM);
        completeFeedback();
        return;
      }

      setStatus("pending");
      setStatusMessage(data.message);
      setForm(INITIAL_FORM);
      completeFeedback();
    } catch {
      setStatus("error");
      setStatusMessage(
        "Something went wrong sending your feedback. Please try again."
      );
    }
  };

  return (
    <MotionWrapper>
      <section
        id="feedback"
        className="border-t border-lex-navy/8 bg-gradient-to-b from-lex-pale/40 to-white py-12 dark:to-lex-surface sm:py-16"
        aria-labelledby="feedback-heading"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lex-gold">
              Pilot feedback
            </p>
            <h2
              id="feedback-heading"
              className="mt-3 font-serif text-3xl font-semibold text-lex-navy sm:text-4xl"
            >
              How was your LexLearn experience?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-lex-navy/75">
              {learnComplete
                ? "Finished a lesson or quiz? Help shape what LexLearn becomes next. This takes less than a minute."
                : "Feedback opens after you try the pilot — complete a lesson or quiz first."}
            </p>
          </div>

          {!learnComplete ? (
            <div className="mt-8 rounded-2xl border border-dashed border-lex-navy/15 bg-lex-pale/20 p-6 text-center sm:p-8">
              <p className="text-sm leading-relaxed text-lex-navy/70">
                Feedback opens after you try the pilot. Start with Module 1, work
                through a lesson, and try the quiz — then come back here to share
                your thoughts.
              </p>
              <Link
                href="/learn/pilot"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-lex-navy/15 bg-white px-4 text-sm font-medium text-lex-navy hover:bg-lex-pale"
              >
                Start the Pilot
              </Link>
            </div>
          ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-8 rounded-2xl border border-lex-navy/10 bg-white p-5 shadow-sm sm:p-8"
            noValidate
          >
            <fieldset>
              <legend className="font-serif text-lg font-semibold text-lex-navy">
                A. What did you try?
              </legend>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {FEEDBACK_ACTIVITIES.map((activity) => {
                  const checked = form.activities.includes(activity);
                  return (
                    <label
                      key={activity}
                      className={cn(
                        "flex min-w-0 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors",
                        checked
                          ? "border-lex-navy/25 bg-lex-pale/50 text-lex-navy"
                          : "border-lex-navy/10 bg-white text-lex-navy/80 hover:bg-lex-pale/30"
                      )}
                    >
                      <input
                        type="checkbox"
                        className="size-4 shrink-0 rounded border-lex-navy/30 text-lex-navy focus:ring-lex-gold"
                        checked={checked}
                        onChange={() => toggleActivity(activity)}
                      />
                      <span className="break-words">
                        {FEEDBACK_ACTIVITY_LABELS[activity]}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.activities && (
                <p className="mt-2 text-sm text-red-700" role="alert">
                  {errors.activities}
                </p>
              )}
            </fieldset>

            <fieldset>
              <legend className="font-serif text-lg font-semibold text-lex-navy">
                B. Did LexLearn make the topic easier to understand?
              </legend>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {CLARITY_RATINGS.map((rating) => (
                  <label
                    key={rating}
                    className={cn(
                      "flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg border px-4 py-3 text-sm font-medium transition-colors sm:min-w-[8rem]",
                      form.clarity === rating
                        ? "border-lex-brand bg-lex-brand text-white"
                        : "border-lex-navy/10 bg-lex-pale/20 text-lex-navy hover:bg-lex-pale/40"
                    )}
                  >
                    <input
                      type="radio"
                      name="clarity"
                      className="sr-only"
                      checked={form.clarity === rating}
                      onChange={() => {
                        setForm((prev) => ({ ...prev, clarity: rating }));
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.clarity;
                          return next;
                        });
                      }}
                    />
                    {CLARITY_LABELS[rating]}
                  </label>
                ))}
              </div>
              {errors.clarity && (
                <p className="mt-2 text-sm text-red-700" role="alert">
                  {errors.clarity}
                </p>
              )}
            </fieldset>

            <fieldset>
              <legend className="font-serif text-lg font-semibold text-lex-navy">
                C. Overall experience
              </legend>
              <div
                className="mt-4 flex flex-wrap items-center gap-1"
                role="radiogroup"
                aria-label="Overall star rating"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} className="cursor-pointer p-1">
                    <input
                      type="radio"
                      name="overallRating"
                      className="sr-only"
                      checked={form.overallRating === rating}
                      onChange={() => {
                        setForm((prev) => ({
                          ...prev,
                          overallRating: rating,
                        }));
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.overallRating;
                          return next;
                        });
                      }}
                    />
                    <Star
                      className={cn(
                        "size-9 transition-colors sm:size-10",
                        form.overallRating >= rating
                          ? "fill-lex-gold text-lex-gold"
                          : "text-lex-navy/25 hover:text-lex-gold/70"
                      )}
                      aria-hidden
                    />
                    <span className="sr-only">{rating} star{rating === 1 ? "" : "s"}</span>
                  </label>
                ))}
              </div>
              {errors.overallRating && (
                <p className="mt-2 text-sm text-red-700" role="alert">
                  {errors.overallRating}
                </p>
              )}
            </fieldset>

            <fieldset>
              <legend className="font-serif text-lg font-semibold text-lex-navy">
                D. Would you use LexLearn again?
              </legend>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                {WOULD_USE_AGAIN.map((option) => (
                  <label
                    key={option}
                    className={cn(
                      "flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                      form.wouldUseAgain === option
                        ? "border-lex-brand bg-lex-brand text-white"
                        : "border-lex-navy/10 bg-lex-pale/20 text-lex-navy hover:bg-lex-pale/40"
                    )}
                  >
                    <input
                      type="radio"
                      name="wouldUseAgain"
                      className="sr-only"
                      checked={form.wouldUseAgain === option}
                      onChange={() => {
                        setForm((prev) => ({
                          ...prev,
                          wouldUseAgain: option,
                        }));
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.wouldUseAgain;
                          return next;
                        });
                      }}
                    />
                    {WOULD_USE_AGAIN_LABELS[option]}
                  </label>
                ))}
              </div>
              {errors.wouldUseAgain && (
                <p className="mt-2 text-sm text-red-700" role="alert">
                  {errors.wouldUseAgain}
                </p>
              )}
            </fieldset>

            <div>
              <label
                htmlFor="improvement"
                className="font-serif text-lg font-semibold text-lex-navy"
              >
                E. What is one thing you would improve or add?
                <span className="ml-1 font-sans text-sm font-normal text-lex-navy/60">
                  (optional)
                </span>
              </label>
              <textarea
                id="improvement"
                rows={4}
                value={form.improvement}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    improvement: event.target.value,
                  }))
                }
                placeholder="Tell us what would make LexLearn more useful for you…"
                className="mt-3 w-full min-w-0 resize-y rounded-lg border border-lex-navy/15 bg-white px-4 py-3 text-sm leading-relaxed text-lex-navy placeholder:text-lex-navy/40 focus:border-lex-navy/30 focus:outline-none focus:ring-2 focus:ring-lex-gold/30"
                maxLength={2000}
              />
              {errors.improvement && (
                <p className="mt-2 text-sm text-red-700" role="alert">
                  {errors.improvement}
                </p>
              )}
            </div>

            {status === "stored" && (
              <div
                className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50/90 p-4 text-sm text-emerald-950"
                role="status"
              >
                <CheckCircle2
                  className="size-5 shrink-0 text-emerald-700"
                  aria-hidden
                />
                <p className="leading-relaxed">{statusMessage}</p>
              </div>
            )}

            {status === "pending" && (
              <div
                className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-950"
                role="status"
              >
                <CheckCircle2
                  className="size-5 shrink-0 text-amber-700"
                  aria-hidden
                />
                <div>
                  <p className="font-medium">Feedback validated — storage pending</p>
                  <p className="mt-1 leading-relaxed">{statusMessage}</p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div
                className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900"
                role="alert"
              >
                <AlertCircle className="size-5 shrink-0" aria-hidden />
                <p>{statusMessage || "Please check the highlighted fields."}</p>
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                disabled={status === "loading"}
                className="h-11 w-full rounded-lg bg-lex-brand px-6 text-white hover:bg-lex-brand/90 sm:w-auto"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Sending…
                  </>
                ) : (
                  "Send feedback"
                )}
              </Button>
              <SurveyLinkButton variant="subtle" />
            </div>

            <p className="text-xs leading-relaxed text-lex-navy/55">
              We do not ask for your name, phone number, address or date of
              birth. Responses are stored without personal identifiers.
            </p>
          </form>
          )}
        </div>
      </section>
    </MotionWrapper>
  );
}
