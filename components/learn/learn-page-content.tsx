"use client";

import { CaseSpotlightCard } from "@/components/learn/case-spotlight";
import { LegalBites } from "@/components/learn/legal-bites";
import { ModuleCard } from "@/components/learn/module-card";
import { StatuteSpotlightCard } from "@/components/learn/statute-spotlight";
import { LegalDisclaimer } from "@/components/layout/legal-disclaimer";
import { PilotJourney } from "@/components/pilot/pilot-journey";
import {
  COURSE_SUBTITLE,
  COURSE_TITLE,
  MODULE_ORDER,
} from "@/lib/course/modules";
import type { ModuleId } from "@/lib/course/types";
import { getModuleLinkedSpotlights } from "@/lib/case-spotlights";
import { getModuleLinkedStatutes } from "@/lib/statute-spotlights";
import { legalFacts } from "@/lib/legal-facts";
import { usePilotJourney } from "@/hooks/use-pilot-journey";

export function LearnPageContent() {
  const { steps } = usePilotJourney();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lex-gold">
          Learning modules
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-lex-navy sm:text-4xl">
          {COURSE_TITLE}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-lex-navy/75">
          {COURSE_SUBTITLE}. Work through each module in order—complete the
          lesson, then take the quiz to unlock the next topic.
        </p>
        <div className="mt-4">
          <LegalDisclaimer />
        </div>
      </header>

      <div className="mb-8 rounded-2xl border border-lex-navy/10 bg-lex-pale/30 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lex-gold">
          Pilot journey
        </p>
        <div className="mt-3">
          <PilotJourney steps={steps} variant="inline" />
        </div>
      </div>

      <section className="mb-8" aria-labelledby="learn-bites-heading">
        <h2
          id="learn-bites-heading"
          className="mb-4 font-serif text-xl font-semibold text-lex-navy"
        >
          Legal Bites
        </h2>
        <LegalBites facts={legalFacts} variant="compact" />
      </section>

      <section className="mb-8" aria-labelledby="learn-case-heading">
        <h2
          id="learn-case-heading"
          className="mb-4 font-serif text-xl font-semibold text-lex-navy"
        >
          Case Spotlight
        </h2>
        <ul className="space-y-4" role="list">
          {getModuleLinkedSpotlights().map((spotlight) => (
            <li key={spotlight.id}>
              <CaseSpotlightCard spotlight={spotlight} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8" aria-labelledby="learn-statute-heading">
        <h2
          id="learn-statute-heading"
          className="mb-4 font-serif text-xl font-semibold text-lex-navy"
        >
          Statute Spotlight
        </h2>
        <ul className="space-y-4" role="list">
          {getModuleLinkedStatutes().map((spotlight) => (
            <li key={spotlight.id}>
              <StatuteSpotlightCard spotlight={spotlight} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mb-4">
        <h2 className="font-serif text-xl font-semibold text-lex-navy">
          Modules
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-lex-navy/70">
          For the pilot, start with Module 1. Completing one lesson and quiz is
          enough to test the experience.
        </p>
      </div>

      <ul className="space-y-4" role="list">
        {MODULE_ORDER.map((moduleId: ModuleId) => (
          <li key={moduleId}>
            <ModuleCard moduleId={moduleId} pilotStart={moduleId === "1"} />
          </li>
        ))}
      </ul>
    </div>
  );
}
