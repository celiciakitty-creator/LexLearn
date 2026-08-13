"use client";

import { cn } from "@/lib/utils";

type SurveyCompleteCheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  variant?: "light" | "dark";
  className?: string;
};

export function SurveyCompleteCheckbox({
  checked,
  onCheckedChange,
  variant = "light",
  className,
}: SurveyCompleteCheckboxProps) {
  const id = "lexlearn-survey-completed";

  return (
    <div className={cn("space-y-2", className)}>
      <p
        className={cn(
          "text-sm leading-relaxed",
          variant === "dark" ? "text-white/75" : "text-lex-navy/70"
        )}
      >
        Already filled it out? Check this so you can move straight to the pilot.
      </p>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
          variant === "dark"
            ? "border-white/15 bg-white/5 hover:bg-white/10"
            : "border-lex-navy/10 bg-white hover:bg-lex-pale/40",
          checked &&
            (variant === "dark"
              ? "border-lex-gold/40 bg-white/10"
              : "border-lex-gold/30 bg-lex-gold/5")
        )}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-lex-navy/30 text-lex-navy focus:ring-lex-gold/40"
        />
        <span
          className={cn(
            "leading-snug",
            variant === "dark" ? "text-white/90" : "text-lex-navy/85"
          )}
        >
          I already took the 2-minute survey
        </span>
      </label>
    </div>
  );
}
