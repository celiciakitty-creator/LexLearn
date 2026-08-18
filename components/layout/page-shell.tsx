import { LegalDisclaimer } from "@/components/layout/legal-disclaimer";
import { SiteHeader } from "@/components/layout/site-header";
import { PilotExperienceLayer } from "@/components/pilot/pilot-experience-layer";

type PageShellProps = {
  children: React.ReactNode;
  showDisclaimer?: boolean;
};

export function PageShell({
  children,
  showDisclaimer = true,
}: PageShellProps) {
  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="min-h-[calc(100vh-var(--site-header-height))] overflow-x-hidden"
      >
        {children}
      </main>
      <PilotExperienceLayer />
      {showDisclaimer && (
        <footer className="lex-section-muted py-4">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <LegalDisclaimer variant="banner" />
          </div>
        </footer>
      )}
    </>
  );
}
