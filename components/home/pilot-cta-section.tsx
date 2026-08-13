"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare, Sparkles } from "lucide-react";

import { MotionWrapper } from "@/components/home/motion-wrapper";
import { SurveyLinkButton } from "@/components/home/survey-link-button";

export function PilotCtaSection() {
  return (
    <MotionWrapper>
      <section
        id="pilot"
        className="border-y border-lex-navy/10 bg-gradient-to-br from-lex-navy via-lex-navy to-[#162d4a] py-12 text-white sm:py-14"
        aria-labelledby="pilot-heading"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-lex-gold">
              <Sparkles className="size-3.5" aria-hidden />
              Early access pilot
            </span>
            <h2
              id="pilot-heading"
              className="mt-5 font-serif text-3xl font-semibold sm:text-4xl"
            >
              Try the LexLearn Pilot
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
              LexLearn is currently being tested with real learners. Try a
              lesson, complete a quiz and tell us what you think.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/learn"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-6 text-base font-medium text-lex-navy shadow-md hover:bg-lex-pale"
              >
                Start a Lesson
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a
                href="#feedback"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-6 text-base font-medium text-white hover:bg-white/15"
              >
                <MessageSquare className="size-4" aria-hidden />
                Give Feedback
              </a>
            </div>

            <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
              <SurveyLinkButton variant="on-dark" />
            </div>

            <p className="mt-6 text-sm text-white/70">
              Help shape what LexLearn becomes next — your input drives this
              startup pilot.
            </p>
          </div>
        </div>
      </section>
    </MotionWrapper>
  );
}
