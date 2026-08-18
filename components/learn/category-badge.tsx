import type { LawCategory } from "@/lib/course/types";
import { cn } from "@/lib/utils";

const categoryStyles: Record<
  LawCategory,
  { badge: string; dot: string }
> = {
  "Civil Law": {
    badge:
      "bg-sky-100 text-sky-900 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-200 dark:ring-sky-800/60",
    dot: "bg-sky-500 dark:bg-sky-400",
  },
  "Criminal Law": {
    badge:
      "bg-violet-100 text-violet-900 ring-violet-200 dark:bg-violet-950/50 dark:text-violet-200 dark:ring-violet-800/60",
    dot: "bg-violet-500 dark:bg-violet-400",
  },
  "Everyday Law": {
    badge:
      "bg-amber-50 text-amber-950 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800/60",
    dot: "bg-lex-gold",
  },
};

type CategoryBadgeProps = {
  category: LawCategory;
  className?: string;
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const styles = categoryStyles[category];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        styles.badge,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", styles.dot)} aria-hidden />
      {category}
    </span>
  );
}
