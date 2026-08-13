"use client";

import { Check, ClipboardList, MessageSquare, Sparkles } from "lucide-react";

import type { PilotJourneySteps } from "@/lib/pilot/journey-state";
import type { JourneyStepState } from "@/lib/pilot/journey-state";
import { cn } from "@/lib/utils";

type PilotJourneyProps = {
  steps: PilotJourneySteps;
  variant?: "light" | "dark" | "inline";
  className?: string;
};

const STEP_META = [
  { key: "survey" as const, label: "Quick Survey", shortLabel: "Survey", icon: ClipboardList },
  { key: "learn" as const, label: "Try LexLearn", shortLabel: "Learn", icon: Sparkles },
  { key: "feedback" as const, label: "Share Feedback", shortLabel: "Feedback", icon: MessageSquare },
];

function stepStyles(state: JourneyStepState, variant: PilotJourneyProps["variant"]) {
  const onDark = variant === "dark";

  if (state === "complete") {
    return onDark
      ? "border-lex-gold/50 bg-lex-gold/15 text-white"
      : "border-lex-gold/40 bg-lex-gold/10 text-lex-navy";
  }
  if (state === "current") {
    return onDark
      ? "border-white/40 bg-white/15 text-white ring-1 ring-lex-gold/40"
      : "border-lex-navy/20 bg-white text-lex-navy ring-1 ring-lex-gold/30 shadow-sm";
  }
  return onDark
    ? "border-white/10 bg-white/5 text-white/55"
    : "border-lex-navy/8 bg-lex-pale/30 text-lex-navy/45";
}

export function PilotJourney({
  steps,
  variant = "light",
  className,
}: PilotJourneyProps) {
  const onDark = variant === "dark";

  return (
    <nav
      aria-label="Pilot journey progress"
      className={cn("w-full min-w-0", className)}
    >
      <ol className="flex min-w-0 items-stretch gap-1 sm:gap-2">
        {STEP_META.map((step, index) => {
          const state = steps[step.key];
          const Icon = step.icon;
          const isLast = index === STEP_META.length - 1;

          return (
            <li key={step.key} className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
              <div
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 sm:flex-row sm:px-3 sm:py-2",
                  stepStyles(state, variant)
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold sm:size-8",
                    state === "complete"
                      ? onDark
                        ? "bg-lex-gold text-lex-navy"
                        : "bg-lex-gold text-lex-navy"
                      : state === "current"
                        ? onDark
                          ? "bg-white text-lex-navy"
                          : "bg-lex-navy text-white"
                        : onDark
                          ? "bg-white/10 text-white/60"
                          : "bg-lex-navy/8 text-lex-navy/50"
                  )}
                  aria-hidden
                >
                  {state === "complete" ? (
                    <Check className="size-3.5 sm:size-4" />
                  ) : (
                    index + 1
                  )}
                </span>
                <div className="min-w-0 text-center sm:text-left">
                  <p className="truncate text-[0.65rem] font-semibold uppercase tracking-wide sm:text-xs">
                    <span className="sm:hidden">{step.shortLabel}</span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </p>
                  {state === "current" && (
                    <p
                      className={cn(
                        "hidden text-[0.65rem] sm:block",
                        onDark ? "text-white/70" : "text-lex-navy/55"
                      )}
                    >
                      Current step
                    </p>
                  )}
                </div>
                <Icon
                  className={cn(
                    "hidden size-4 shrink-0 sm:block",
                    state === "complete"
                      ? "text-lex-gold"
                      : state === "current"
                        ? onDark
                          ? "text-lex-gold"
                          : "text-lex-navy"
                        : onDark
                          ? "text-white/40"
                          : "text-lex-navy/30"
                  )}
                  aria-hidden
                />
              </div>
              {!isLast && (
                <span
                  className={cn(
                    "hidden h-px w-2 shrink-0 sm:block sm:w-3",
                    onDark ? "bg-white/20" : "bg-lex-navy/15"
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
