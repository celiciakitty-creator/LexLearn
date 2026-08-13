"use client";

import { ExternalLink } from "lucide-react";

import { getSurveyUrl } from "@/lib/survey-config";
import { cn } from "@/lib/utils";

type SurveyLinkButtonProps = {
  variant?: "default" | "on-dark" | "subtle";
  className?: string;
};

export function SurveyLinkButton({
  variant = "default",
  className,
}: SurveyLinkButtonProps) {
  const surveyUrl = getSurveyUrl();

  if (!surveyUrl) {
    return null;
  }

  const styles = {
    default:
      "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-lex-navy/15 bg-white px-4 text-sm font-medium text-lex-navy shadow-sm hover:bg-lex-pale",
    "on-dark":
      "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/20 bg-transparent px-4 text-sm font-medium text-white/90 hover:bg-white/10",
    subtle:
      "inline-flex items-center gap-1.5 text-sm font-medium text-lex-navy/75 underline decoration-lex-gold/50 underline-offset-2 hover:text-lex-navy hover:decoration-lex-gold",
  } as const;

  return (
    <a
      href={surveyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(styles[variant], className)}
    >
      Take the 2-Minute Survey
      {variant !== "subtle" && (
        <ExternalLink className="size-3.5 shrink-0" aria-hidden />
      )}
    </a>
  );
}
