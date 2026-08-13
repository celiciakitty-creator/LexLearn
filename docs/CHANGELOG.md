# Changelog

All notable changes to LexLearn are documented here.

## [Unreleased]

### Added (Week 5 startup pilot)

- **Homepage repositioning** — pilot messaging, clearer value proposition for young audiences
- **How it works** section — bite-sized lessons, quizzes, legal facts, progress highlights
- **Who is LexLearn for?** — four audience cards with Lucide icons
- **Three learning areas** — Civil, Criminal and Everyday Law with England & Wales note
- **Pilot CTA** — prominent “Try the LexLearn Pilot” section + subtle hero pilot link
- **Native feedback form** — `FeedbackSection` at `/#feedback` with validation and loading/error states
- **Feedback architecture** — `lib/feedback/` types, validation, persistence abstraction; `POST /api/feedback` (returns 202, persistence pending)
- **Survey CTA** — optional `NEXT_PUBLIC_LEXLEARN_SURVEY_URL` via `SurveyLinkButton`
- **Week 5 metrics plan** — `docs/WEEK5_METRICS_PLAN.md` (hook points only; no tracking implemented)
- **Mobile overflow guard** — `overflow-x-hidden` on main content shell

### Added (Week 5 metrics integration)

- **Anonymous metrics identity** — HttpOnly cookies `lexlearn_metrics_uid` (~1 year) and `lexlearn_metrics_sid` (~24h); no PII
- **Server proxy** — `POST /api/metrics/events` forwards qualifying events to the Hult/Ludwitt reference API with server-side bearer auth
- **Event hooks** — `lesson_started` / `lesson_completed` in `LessonView`; `quiz_submitted` in `QuizView`
- **Strict Mode dedupe** — `sessionStorage` + ref guard for `lesson_started` per module
- **CLI verification** — `npm run metrics:check` prints `unique_users` and `qualified_users` only
- **Environment variables** — `HULT_METRICS_API_BASE_URL`, `HULT_METRICS_APP_ID`, `HULT_METRICS_DEV_API_KEY` (server-only)

### Added (Ludwitt OAuth — prior)
- **Encrypted HttpOnly session cookie** — server-managed tokens; `/api/auth/me` returns public profile only
- **Auth header** — “Sign in with Ludwitt”, learner name/avatar, logout action
- **Lesson and quiz auth gates** — Ludwitt sign-in prompt before tracked learning when OAuth is configured
- **Branded OAuth error page** at `/auth/error`
- **Server utilities** in `lib/ludwitt/` — config, PKCE, oauth-client, session-crypto, cookies, session
- **`.env.example`** — documents required Ludwitt environment variables

### Security

- No tokens in `localStorage`, `sessionStorage`, URL params, or client-readable cookies
- CSRF state + PKCE verification; Secure cookies in production

### Not included (intentional)

- Ludwitt AI proxy and credit spending
- Hult JWT launch / learning events integration (pending cohort clarification)
- Production callback URL (requires Ludwitt staff setup)

### Added (prior unreleased work)

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
