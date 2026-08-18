"use client";

import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import type { LevelProgress } from "@/lib/progress/levels";
import { cn } from "@/lib/utils";

type LearningLevelCardProps = {
  levelProgress: LevelProgress;
  className?: string;
  compact?: boolean;
};

export function LearningLevelCard({
  levelProgress,
  className,
  compact = false,
}: LearningLevelCardProps) {
  const { current, next, completedModules, totalModules, progressToNext } =
    levelProgress;

  return (
    <div
      className={cn(
        "lex-surface-card bg-gradient-to-br from-lex-pale/60 to-white p-5 dark:from-lex-pale/50 dark:to-lex-card",
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lex-gold">
        Your learning level
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-lex-navy">
        {current.title}
      </h2>
      {!compact && (
        <p className="mt-2 lex-body-sm">
          {current.description}
        </p>
      )}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-lex-muted">
            {next
              ? `Progress to ${next.title}`
              : "Highest level reached"}
          </span>
          <span className="font-medium tabular-nums text-lex-navy">
            {completedModules} / {totalModules} modules
          </span>
        </div>
        <Progress value={progressToNext} className="gap-0">
          <ProgressTrack className="h-2.5 bg-lex-pale dark:bg-lex-pale/80">
            <ProgressIndicator className="rounded-full bg-lex-gold" />
          </ProgressTrack>
        </Progress>
        {next && (
          <p className="mt-2 lex-fine-print">
            Complete {next.minCompletedModules - completedModules} more module
            {next.minCompletedModules - completedModules === 1 ? "" : "s"} to
            reach {next.title}.
          </p>
        )}
      </div>
    </div>
  );
}
