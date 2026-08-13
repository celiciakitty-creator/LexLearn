import type { Metadata } from "next";

import { PilotIntroContent } from "@/components/pilot/pilot-intro-content";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Start the Pilot | LexLearn",
  description:
    "Welcome to the LexLearn pilot — start with Module 1, try a short lesson and quiz, then share feedback.",
};

export default function PilotIntroPage() {
  return (
    <PageShell>
      <PilotIntroContent />
    </PageShell>
  );
}
