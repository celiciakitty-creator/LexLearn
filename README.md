# LexLearn

LexLearn is a **Week 5 startup pilot** — a beginner-friendly UK law learning platform helping young people understand **everyday legal rights** without prior legal knowledge.

**Value proposition:** *A simpler way to understand UK law and your everyday legal rights.*

Content focuses on the law of **England and Wales** unless a section explicitly states otherwise. LexLearn is in **early access** — we are testing with real learners and collecting pilot feedback to shape what comes next.

**Production URL:** https://lex-learn-ten.vercel.app/

Interactive lessons, realistic scenarios, Case Spotlight and Statute Spotlight explainers, Legal Bites, quizzes, and local progress tracking help learners understand how law applies in everyday life—without replacing professional legal advice.

## Target users

- Young people curious about their rights
- Prospective and current law students
- Anyone who wants everyday UK law explained clearly — not like a law firm brochure

## Learning areas

| Area | Topics | Modules |
|------|--------|---------|
| **Civil Law** | Contracts, negligence, consumer disputes | 1–2 |
| **Criminal Law** | Acts, intent, self-defence, offences | 3–4 |
| **Everyday Law** | Shopping, work, housing, practical rights | 5 |

## Screenshots

Add production screenshots to `README-assets/` when available:

| Screenshot | Path | Status |
|------------|------|--------|
| Homepage | `README-assets/homepage.png` | Placeholder — capture after deploy |
| Learning dashboard | `README-assets/learn-dashboard.png` | Placeholder — `/learn` |
| Lesson | `README-assets/lesson.png` | Placeholder — `/learn/1` |
| Quiz | `README-assets/quiz.png` | Placeholder — `/quiz/1` |
| Progress | `README-assets/progress.png` | Placeholder — `/progress` |

**Open Graph image:** Generated at build time by `app/opengraph-image.tsx` (1200×630).

## Current features

- **Five-module learning path** with sequential unlock (quiz pass required)
- **Module lessons** with learning objectives, scenarios, key terms, embedded knowledge checks, and takeaways
- **Module quizzes** — five multiple-choice questions with immediate explanations (pass threshold: 3/5)
- **Case Spotlight** — reusable case/scenario cards linked to modules
- **Statute Spotlight** — reusable statute explainers (e.g. Consumer Rights Act 2015)
- **Legal Bites** — categorised legal facts with review status badges
- **Achievements** — stored in browser localStorage (First Lesson, First Quiz, category starters, Five Correct Answers)
- **Learning levels** — Legal Beginner through LexLearn Scholar
- **Progress dashboard** at `/progress`
- **Pilot homepage** — audience section, learning areas, pilot CTA, native feedback form
- **Pilot feedback UI** — validated via `POST /api/feedback` (central persistence pending backend selection)
- **Optional market survey CTA** — when `NEXT_PUBLIC_LEXLEARN_SURVEY_URL` is set
- **Ludwitt OAuth sign-in** — server-managed sessions for tracked lessons and quizzes
- **Legal disclaimer** on lessons, quizzes, and site footer

## Pilot feedback

Native feedback form at `/#feedback` on the homepage. Submissions are validated server-side but **not centrally stored yet** — persistence is pending after the Week 5 reference API review. See `lib/feedback/` and `POST /api/feedback`.

## Market-validation survey

Optional external survey link via `NEXT_PUBLIC_LEXLEARN_SURVEY_URL`. When unset, survey buttons are hidden. Do not hardcode Google Forms URLs in components.

## Week 5 metrics

LexLearn reports qualifying learning events to the production reference API via a **server-side proxy** (`POST /api/metrics/events`). Anonymous HttpOnly cookies (`lexlearn_metrics_uid`, `lexlearn_metrics_sid`) identify learners without PII. OAuth sign-in is unchanged and independent.

| Variable | Required | Notes |
|----------|----------|-------|
| `HULT_METRICS_API_BASE_URL` | For metrics | Server-only; default `https://lexlearn-week5-metrics-api.vercel.app` |
| `HULT_METRICS_APP_ID` | For metrics | Server-only; LexLearn registered app id |
| `HULT_METRICS_DEV_API_KEY` | For metrics | Server-only developer bearer token — never `NEXT_PUBLIC_*` |

Check counts locally: `npm run metrics:check` (prints `unique_users` / `qualified_users` only).

See [docs/WEEK5_METRICS_PLAN.md](docs/WEEK5_METRICS_PLAN.md) for qualification rules and proof process.

## Current modules

| # | Module | Category | Status |
|---|--------|----------|--------|
| 1 | Contracts in Everyday Life | Civil Law | Live |
| 2 | Negligence and Duty of Care | Civil Law | Live |
| 3 | Crime: Acts, Intent and Responsibility | Criminal Law | Live |
| 4 | Assault, Self-Defence and Weapons | Criminal Law | Live |
| 5 | Your Everyday Legal Rights | Everyday Law | Live |

**Unlock order:** Module 1 → 2 → 3 → 4 → 5 (each unlocks when the previous module quiz is passed).

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Base UI)
- Framer Motion
- Lucide icons
- Playfair Display + Geist fonts
- Browser `localStorage` for progress and achievements (no database)

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

## Environment variables

`.env.local` is gitignored. `.env.example` contains **placeholders only**.

| Variable | Required | Notes |
|----------|----------|-------|
| `LUDWITT_CLIENT_ID` | For OAuth | Server-only |
| `LUDWITT_CLIENT_SECRET` | For OAuth | Server-only |
| `LUDWITT_REDIRECT_URI` | For OAuth | Must match Ludwitt app registration exactly |
| `LUDWITT_SESSION_SECRET` | For OAuth | ≥32 characters; encrypts HttpOnly session cookie |
| `NEXT_PUBLIC_SITE_URL` | Production | Public site URL for metadata/Open Graph (no trailing slash) |
| `NEXT_PUBLIC_LEXLEARN_SURVEY_URL` | Optional | External market-validation survey; hides CTA when unset |
| `HULT_METRICS_API_BASE_URL` | For metrics | Server-only reference API origin |
| `HULT_METRICS_APP_ID` | For metrics | Server-only registered LexLearn app id |
| `HULT_METRICS_DEV_API_KEY` | For metrics | Server-only developer API key |
| `FEEDBACK_PERSISTENCE_BACKEND` | Optional | Not configured in Week 5 pilot |

### Callback URL formats

| Environment | `LUDWITT_REDIRECT_URI` |
|-------------|------------------------|
| Local | `http://localhost:3000/auth/callback` |
| Production | `https://<your-production-domain>/auth/callback` |

When Ludwitt env vars are unset, LexLearn runs in local-only mode (progress still uses `localStorage`; auth gates allow access).

## Deploy to Vercel

1. Push the repository to GitHub or GitLab and import the project in [Vercel](https://vercel.com).
2. Set environment variables in Vercel (Production and Preview as needed).
3. Register the production callback URL with Ludwitt staff for your OAuth client.
4. Deploy.

### Deployment blockers (known)

| Blocker | Status |
|---------|--------|
| Ludwitt OAuth `invalid_client` | **Awaiting platform clarification** |
| Production callback URL | Must be registered with Ludwitt for your deployed domain |
| Week 5 learning events API | **Implemented** — proxy + anonymous cookies |
| Feedback central persistence | **Pending** — backend selection after API review |
| Ludwitt AI credit proxy | **Not implemented** |

## Project structure

```
app/              # Routes (home, learn, quiz, progress, auth, api/feedback)
components/       # UI (home, learn, layout)
hooks/            # useProgress, useAchievements
lib/
  course/         # Module registry and lesson/quiz content
  feedback/       # Pilot feedback types, validation, persistence abstraction
  ludwitt/        # OAuth client, PKCE, encrypted session cookie
  metrics/        # Week 5 anonymous metrics (cookies, proxy client, validation)
  achievements/   # Achievement definitions and evaluation
  progress/       # localStorage progress and learning levels
  survey-config.ts
docs/             # Architecture, Week 5 metrics plan, changelog
```

See `docs/ARCHITECTURE.md` for full technical documentation.

## Project status

| Area | Status |
|------|--------|
| All five modules | **Live** |
| Week 5 pilot homepage | **Live** |
| Pilot feedback UI | **Live** — persistence pending |
| Week 5 metrics events | **Live** — see `docs/WEEK5_METRICS_PLAN.md` |
| Ludwitt OAuth | **Implemented** — platform `invalid_client` pending |
| Hult JWT launch / learning events | **Pending** — separate from Pitchrise OAuth |

## Disclaimer

LexLearn provides **general educational information about UK law and is not legal advice**. For legal problems, consult a qualified professional.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Week 5 metrics plan](docs/WEEK5_METRICS_PLAN.md)
- [Content plan](docs/CONTENT_PLAN.md)
- [Changelog](docs/CHANGELOG.md)
- [Legal review checklist](docs/LEGAL_REVIEW.md)
