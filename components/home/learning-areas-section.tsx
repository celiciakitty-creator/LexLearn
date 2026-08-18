"use client";

import Link from "next/link";
import { Gavel, Home, Scale } from "lucide-react";

import { MotionHover, MotionWrapper } from "@/components/home/motion-wrapper";
import { SUBJECT_CATEGORIES } from "@/lib/course/modules";

const areaDetails: Record<
  (typeof SUBJECT_CATEGORIES)[number],
  { icon: typeof Scale; description: string; modules: string }
> = {
  "Civil Law": {
    icon: Scale,
    description:
      "Everyday disagreements, contracts, negligence, consumer issues and other disputes between people or organisations.",
    modules: "Modules 1–2",
  },
  "Criminal Law": {
    icon: Gavel,
    description:
      "How criminal responsibility, intent, self-defence, offences and legal consequences work.",
    modules: "Modules 3–4",
  },
  "Everyday Law": {
    icon: Home,
    description:
      "Practical rights that can affect shopping, work, housing and ordinary life.",
    modules: "Module 5",
  },
};

export function LearningAreasSection() {
  return (
    <MotionWrapper>
      <section
        id="learning-areas"
        className="py-12 sm:py-14"
        aria-labelledby="learning-areas-heading"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="lex-eyebrow">
              Three learning areas
            </p>
            <h2
              id="learning-areas-heading"
              className="mt-3 font-serif text-3xl font-semibold text-lex-navy sm:text-4xl"
            >
              Start with the basics
            </h2>
            <p className="mt-4 lex-body">
              LexLearn currently focuses on law applicable primarily to{" "}
              <strong className="font-medium text-lex-navy">
                England and Wales
              </strong>
              . No prior legal knowledge is required.
            </p>
          </div>

          <ul className="mt-8 grid gap-4 lg:grid-cols-3" role="list">
            {SUBJECT_CATEGORIES.map((category, index) => {
              const detail = areaDetails[category];
              const Icon = detail.icon;

              return (
                <li key={category} className="min-w-0">
                  <MotionHover>
                    <MotionWrapper delay={index * 0.05}>
                      <article className="lex-surface-card flex h-full flex-col p-5 sm:p-6">
                        <span className="lex-icon-well size-11">
                          <Icon
                            className="size-5"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                        </span>
                        <h3 className="mt-4 font-serif text-xl font-semibold text-lex-navy">
                          {category}
                        </h3>
                        <p className="mt-2 flex-1 lex-body-sm">
                          {detail.description}
                        </p>
                        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-lex-gold">
                          {detail.modules}
                        </p>
                      </article>
                    </MotionWrapper>
                  </MotionHover>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <Link
              href="/learn"
              className="lex-btn-secondary h-11 px-6 text-sm"
            >
              Browse all modules
            </Link>
          </div>
        </div>
      </section>
    </MotionWrapper>
  );
}
