"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type SurveyCompleteButtonProps = {
  completed: boolean;
  onComplete: () => void;
  variant?: "light" | "dark";
  className?: string;
};

export function SurveyCompleteButton({
  completed,
  onComplete,
  variant = "light",
  className,
}: SurveyCompleteButtonProps) {
  if (completed) {
    return (
      <p
        className={cn(
          "inline-flex items-center gap-1.5 text-sm font-medium",
          variant === "dark" ? "text-lex-gold" : "text-emerald-700",
          className
        )}
      >
        <Check className="size-4 shrink-0" aria-hidden />
        Survey marked complete
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={onComplete}
      className={cn(
        "text-sm font-medium underline decoration-lex-gold/50 underline-offset-2 transition-colors",
        variant === "dark"
          ? "text-white/75 hover:text-white hover:decoration-white/60"
          : "text-lex-navy/70 hover:text-lex-navy hover:decoration-lex-gold",
        className
      )}
    >
      I&apos;ve completed the survey
    </button>
  );
}
