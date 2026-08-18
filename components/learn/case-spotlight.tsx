import Link from "next/link";
import { ArrowRight, Gavel } from "lucide-react";

import { CategoryBadge } from "@/components/learn/category-badge";
import type { CaseSpotlight } from "@/lib/case-spotlights";
import { cn } from "@/lib/utils";

type CaseSpotlightProps = {
  spotlight: CaseSpotlight;
  className?: string;
  showLearnMore?: boolean;
};

export function CaseSpotlightCard({
  spotlight,
  className,
  showLearnMore = true,
}: CaseSpotlightProps) {
  return (
    <article
      className={cn(
        "lex-surface-card overflow-hidden shadow-sm",
        className
      )}
      aria-labelledby={`case-spotlight-${spotlight.id}`}
    >
      <div className="lex-card-header-band bg-gradient-to-r from-lex-pale/80 to-white px-5 py-4 dark:from-lex-pale/60 dark:to-lex-card sm:px-6">
        <div className="flex items-start gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lex-brand text-white ring-1 ring-lex-navy/20"
            aria-hidden
          >
            <Gavel className="size-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lex-gold">
              Case Spotlight
            </p>
            <div className="mt-2">
              <CategoryBadge category={spotlight.category} />
            </div>
            <h2
              id={`case-spotlight-${spotlight.id}`}
              className="mt-2 font-serif text-xl font-semibold text-lex-navy sm:text-2xl"
            >
              {spotlight.title}
            </h2>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5 sm:px-6">
        <section aria-labelledby={`case-why-${spotlight.id}`}>
          <h3
            id={`case-why-${spotlight.id}`}
            className="text-sm font-semibold text-lex-navy"
          >
            Why it matters
          </h3>
          <p className="mt-2 lex-body-sm">
            {spotlight.whyItMatters}
          </p>
        </section>

        <section aria-labelledby={`case-explainer-${spotlight.id}`}>
          <h3
            id={`case-explainer-${spotlight.id}`}
            className="text-sm font-semibold text-lex-navy"
          >
            Beginner explanation
          </h3>
          <p className="mt-2 lex-body-sm">
            {spotlight.explanation}
          </p>
        </section>

        {showLearnMore && spotlight.learnMoreHref && (
          <Link
            href={spotlight.learnMoreHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-lex-navy underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lex-gold/40"
          >
            Learn more
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}

        {showLearnMore && !spotlight.learnMoreHref && (
          <p className="text-sm text-lex-subtle">
            Learn more — coming soon
          </p>
        )}
      </div>
    </article>
  );
}
