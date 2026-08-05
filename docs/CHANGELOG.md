# Changelog

All notable changes to LexLearn are documented here.

## [Unreleased]

### Added

- **Module 4 — Assault, Self-Defence and Weapons** — full lesson, late-night shop scenario, R v Williams (Gladstone) Case Spotlight, knowledge check, 5-question quiz (`lib/course/content/module-4.ts`)
- **Module 5 — Your Everyday Legal Rights** — full lesson, faulty phone scenario, Consumer Rights Act 2015 Statute Spotlight, knowledge check, 5-question quiz (`lib/course/content/module-5.ts`)
- **Statute Spotlight** — reusable `StatuteSpotlightCard` component and `lib/statute-spotlights.ts`
- **Legal Bites** for Modules 4 and 5 (assault/battery, reasonable force, CRA 2015, legal info vs advice, tenancy deposits)
- **Case Spotlight** — R v Williams (Gladstone) with module link

### Changed

- All five modules now `hasContent: true` — full course available
- Lesson view embeds Statute Spotlight when `statuteSpotlightId` is set
- `/learn` lists module-linked Case and Statute Spotlights
- Homepage Case Spotlight features Williams (Gladstone) (Module 4)
- `README.md`, `docs/CONTENT_PLAN.md`, `docs/LEGAL_REVIEW.md` updated

## [Modules 2 and 3]

### Added

- **Case Spotlight** — reusable `CaseSpotlightCard` component
- **Legal Bites** — categorised fact carousel with review badges
- **Achievement system** — five starter achievements in localStorage
- **Learning levels** — Legal Beginner → LexLearn Scholar
- **Why Learn UK Law?** homepage section
- **Documentation** — `docs/ARCHITECTURE.md`, `docs/CONTENT_PLAN.md`, `docs/CHANGELOG.md`

### Fixed

- `useSyncExternalStore` progress hook — stable snapshots
- Hero LCP image preload via server component

## [Initial platform]

### Added

- Next.js 16 App Router with botanical LexLearn design
- Three subject categories; five-module roadmap
- Module 1 (Contracts in Everyday Life) with lesson + quiz
- localStorage progress and module unlock logic
- Routes: `/`, `/learn`, `/learn/[moduleId]`, `/quiz/[moduleId]`, `/progress`

### Not included

- Ludwitt / Hult integration
- Modules 4–5 content
- User authentication or server-side progress sync
