"use client";

import { MessageSquare, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { usePilotJourney } from "@/hooks/use-pilot-journey";
import { cn } from "@/lib/utils";

type PilotFeedbackPromptProps = {
  className?: string;
};

export function PilotFeedbackPrompt({ className }: PilotFeedbackPromptProps) {
  const { showFeedbackPrompt, dismissPrompt } = usePilotJourney();
  const router = useRouter();
  const pathname = usePathname();

  if (!showFeedbackPrompt) {
    return null;
  }

  const scrollToFeedback = () => {
    if (pathname === "/") {
      const target = document.getElementById("feedback");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    router.push("/#feedback");
  };

  return (
    <aside
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6",
        className
      )}
      aria-live="polite"
    >
      <div className="pointer-events-auto mx-auto flex max-w-lg flex-col gap-3 rounded-2xl border border-lex-navy/12 bg-white p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lex-gold/15 text-lex-navy">
              <MessageSquare className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="font-serif text-lg font-semibold text-lex-navy">
                How was LexLearn?
              </p>
              <p className="mt-1 text-sm leading-relaxed text-lex-navy/70">
                You&apos;ve completed part of the pilot — tell us what worked and
                what could be better. It takes less than a minute.
              </p>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-stretch">
          <Button
            type="button"
            onClick={scrollToFeedback}
            className="h-10 flex-1 rounded-lg bg-lex-navy px-4 text-white hover:bg-lex-navy/90 sm:flex-none"
          >
            Give Feedback
          </Button>
          <button
            type="button"
            onClick={dismissPrompt}
            className="inline-flex h-10 items-center justify-center gap-1 rounded-lg px-3 text-sm font-medium text-lex-navy/60 hover:bg-lex-pale hover:text-lex-navy"
          >
            <X className="size-4 sm:hidden" aria-hidden />
            <span>Later</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
