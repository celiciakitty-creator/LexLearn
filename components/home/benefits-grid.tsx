"use client";

import { MotionHover, MotionWrapper } from "@/components/home/motion-wrapper";
import { benefits } from "@/lib/homepage-data";

export function BenefitsGrid() {
  return (
    <MotionWrapper delay={0.08}>
      <section id="about" className="mt-10" aria-labelledby="benefits-heading">
        <h2
          id="benefits-heading"
          className="mb-5 font-serif text-2xl font-semibold text-lex-navy"
        >
          Why Learn with LexLearn?
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {benefits.map((benefit, index) => (
            <li key={benefit.title}>
              <MotionHover>
                <MotionWrapper delay={0.04 * index}>
                  <article className="lex-surface-card-sm flex h-full gap-4 p-5 transition-shadow hover:shadow-md dark:hover:shadow-none">
                    <span className="lex-icon-well size-10 shrink-0">
                      <benefit.icon className="size-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-medium text-lex-navy">{benefit.title}</h3>
                      <p className="mt-1 lex-body-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </article>
                </MotionWrapper>
              </MotionHover>
            </li>
          ))}
        </ul>
      </section>
    </MotionWrapper>
  );
}
