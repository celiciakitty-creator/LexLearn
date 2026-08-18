"use client";

import { Briefcase, HeartHandshake, Shield, Users } from "lucide-react";

import { MotionWrapper } from "@/components/home/motion-wrapper";

const reasons = [
  {
    icon: Briefcase,
    title: "Understand everyday agreements",
    description:
      "From online purchases to informal deals, civil law shapes how promises become binding obligations.",
  },
  {
    icon: Shield,
    title: "Know your rights and responsibilities",
    description:
      "Criminal and everyday law help you recognise when conduct may have legal consequences—and when protections apply.",
  },
  {
    icon: Users,
    title: "Make informed decisions",
    description:
      "Legal knowledge supports clearer conversations with employers, landlords, retailers and public services.",
  },
  {
    icon: HeartHandshake,
    title: "Build confidence, not fear",
    description:
      "LexLearn explains UK law in plain language so you can learn proactively without needing a law degree.",
  },
] as const;

export function WhyLearnSection() {
  return (
    <MotionWrapper>
      <section
        id="why-learn"
        className="lex-section-soft border-t py-14 sm:py-16"
        aria-labelledby="why-learn-heading"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="lex-eyebrow">
              Why Learn UK Law?
            </p>
            <h2
              id="why-learn-heading"
              className="mt-3 font-serif text-3xl font-semibold text-lex-navy sm:text-4xl"
            >
              Practical value for everyday life
            </h2>
            <p className="mt-4 lex-body">
              UK law is not only for lawyers. Understanding civil, criminal and
              everyday legal topics helps you navigate real situations with
              greater clarity—whether you are buying goods, resolving disputes
              or exercising your rights.
            </p>
          </div>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {reasons.map((reason) => (
              <li
                key={reason.title}
                className="lex-surface-card p-5"
              >
                <span className="lex-icon-well size-10">
                  <reason.icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-lex-navy">
                  {reason.title}
                </h3>
                <p className="mt-2 lex-body-sm">
                  {reason.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </MotionWrapper>
  );
}
