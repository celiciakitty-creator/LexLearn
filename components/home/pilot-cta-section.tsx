"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { MotionWrapper } from "@/components/home/motion-wrapper";
import { SurveyLinkButton } from "@/components/home/survey-link-button";
import { PilotJourney } from "@/components/pilot/pilot-journey";
import { SurveyCompleteButton } from "@/components/pilot/survey-complete-button";
import { usePilotJourney } from "@/hooks/use-pilot-journey";
import { isSurveyConfigured } from "@/lib/survey-config";

export function PilotCtaSection() {
  const { steps, surveyComplete, completeSurvey } = usePilotJourney();
  const surveyConfigured = isSurveyConfigured();

  return (
    <MotionWrapper>
      <section
        id="pilot"
        className="border-y border-lex-navy/10 bg-gradient-to-br from-lex-navy via-lex-navy to-[#162d4a] py-12 text-white sm:py-14"
        aria-labelledby="pilot-heading"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
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
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lex-gold">
                Before you start
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
                Help us understand what young learners actually want. The survey
                takes about 2 minutes.
              </p>

              <div className="mt-5">
                <PilotJourney steps={steps} variant="dark" />
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {surveyConfigured ? (
                  <>
                    <SurveyLinkButton
                      variant="on-dark"
                      className="h-11 w-full justify-center text-base sm:w-auto sm:self-start"
                    />
                    <SurveyCompleteButton
                      completed={surveyComplete}
                      onComplete={completeSurvey}
                      variant="dark"
                    />
                  </>
                ) : (
                  <p className="text-sm text-white/70">
                    Market survey link not configured for this environment.
                  </p>
                )}

                <div className="mt-2 border-t border-white/10 pt-5">
                  <p className="text-sm text-white/75">
                    Already completed it? Start the pilot.
                  </p>
                  <Link
                    href="/learn/pilot"
                    className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-6 text-base font-medium text-lex-navy shadow-md hover:bg-lex-pale sm:w-auto"
                  >
                    Start the Pilot
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-white/70">
              No sign-in required. One lesson and quiz is enough to test the
              experience — feedback opens after you try it.
            </p>
          </div>
        </div>
      </section>
    </MotionWrapper>
  );
}
