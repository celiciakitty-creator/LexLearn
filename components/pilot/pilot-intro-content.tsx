"use client";

import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";

import { PilotJourney } from "@/components/pilot/pilot-journey";
import { usePilotJourney } from "@/hooks/use-pilot-journey";

export function PilotIntroContent() {
  const { steps } = usePilotJourney();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lex-gold">
          LexLearn pilot
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-lex-navy sm:text-4xl">
          Welcome to the LexLearn Pilot
        </h1>
        <p className="mt-4 text-base leading-relaxed text-lex-navy/75">
          You do not need any legal background. Start with Module 1, work through
          one short lesson, then try the quiz. When you&apos;re done, we&apos;ll
          ask for quick feedback.
        </p>
      </header>

      <div className="mt-8">
        <PilotJourney steps={steps} variant="inline" />
      </div>

      <ul className="mt-8 space-y-3 rounded-2xl border border-lex-navy/10 bg-lex-pale/25 p-5 text-sm text-lex-navy/80">
        <li className="flex items-start gap-3">
          <Clock className="mt-0.5 size-4 shrink-0 text-lex-gold" aria-hidden />
          <span>
            <strong className="font-medium text-lex-navy">About 5–10 minutes</strong>{" "}
            for one lesson and quiz
          </span>
        </li>
        <li className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-lex-gold" aria-hidden />
          <span>
            <strong className="font-medium text-lex-navy">No sign-in required</strong>{" "}
            — start learning straight away
          </span>
        </li>
      </ul>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/learn/1"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-lex-brand px-6 text-base font-medium text-white shadow-md hover:bg-lex-brand/90"
        >
          Begin Module 1
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link
          href="/learn"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-lex-navy/15 bg-white px-6 text-base font-medium text-lex-navy hover:bg-lex-pale"
        >
          Browse all modules
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-lex-navy/60 sm:text-left">
        For the pilot, completing one lesson and quiz is enough to test the
        experience.
      </p>
    </div>
  );
}
