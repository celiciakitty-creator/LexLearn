"use client";

import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Scale,
  Sparkles,
  Users,
} from "lucide-react";

import { MotionWrapper } from "@/components/home/motion-wrapper";

const audiences = [
  {
    icon: Users,
    title: "Curious young people",
    description:
      "Understand your everyday rights without needing any legal background.",
  },
  {
    icon: GraduationCap,
    title: "Prospective law students",
    description:
      "Explore UK law topics in plain language before starting formal study.",
  },
  {
    icon: BookOpen,
    title: "Current students",
    description:
      "Refresh civil, criminal and practical topics with bite-sized lessons and quizzes.",
  },
  {
    icon: Scale,
    title: "Everyday learners",
    description:
      "Learn how law can affect shopping, work, housing and ordinary life.",
  },
] as const;

export function AudienceSection() {
  return (
    <MotionWrapper>
      <section
        id="who-its-for"
        className="lex-section-panel py-12 sm:py-14"
        aria-labelledby="audience-heading"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="lex-eyebrow">
              Who is LexLearn for?
            </p>
            <h2
              id="audience-heading"
              className="mt-3 font-serif text-3xl font-semibold text-lex-navy sm:text-4xl"
            >
              Built for anyone starting out
            </h2>
            <p className="mt-4 lex-body">
              You do not need prior legal knowledge. LexLearn is designed for
              people who want law explained clearly — not like a law firm
              brochure.
            </p>
          </div>

          <ul
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            role="list"
          >
            {audiences.map((item) => (
              <li
                key={item.title}
                className="lex-surface-card min-w-0 bg-lex-pale/20 p-5 dark:bg-lex-pale/40"
              >
                <span className="lex-icon-well size-10 bg-white dark:bg-lex-card">
                  <item.icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-lex-navy">
                  {item.title}
                </h3>
                <p className="mt-2 lex-body-sm">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </MotionWrapper>
  );
}

export function HowItWorksSection() {
  const highlights = [
    { icon: BookOpen, label: "Bite-sized lessons" },
    { icon: Users, label: "Real-life situations" },
    { icon: ClipboardCheck, label: "Quizzes" },
    { icon: Sparkles, label: "Quick legal facts" },
    { icon: Scale, label: "Case explanations" },
    { icon: GraduationCap, label: "Progress and achievements" },
  ] as const;

  return (
    <MotionWrapper>
      <section
        className="lex-section-soft py-10 sm:py-12"
        aria-labelledby="how-it-works-heading"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="lex-eyebrow">
              How LexLearn works
            </p>
            <h2
              id="how-it-works-heading"
              className="mt-3 font-serif text-2xl font-semibold text-lex-navy sm:text-3xl"
            >
              Law made easier to understand
            </h2>
            <p className="mt-4 lex-body">
              LexLearn breaks UK law into friendly, practical learning — using
              short lessons, everyday examples and quick checks so you can build
              confidence step by step.
            </p>
          </div>

          <ul
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
            role="list"
          >
            {highlights.map((item) => (
              <li
                key={item.label}
                className="lex-surface-card-sm flex min-w-0 flex-col items-center px-3 py-4 text-center"
              >
                <span className="lex-icon-well size-9">
                  <item.icon className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="mt-3 text-xs font-medium leading-snug text-lex-navy sm:text-sm">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 lex-caption">
            Currently testing as an early-access pilot.{" "}
            <Link
              href="#pilot"
              className="font-medium text-lex-navy underline decoration-lex-gold/60 underline-offset-2 hover:decoration-lex-gold"
            >
              Try the pilot
            </Link>
          </p>
        </div>
      </section>
    </MotionWrapper>
  );
}
