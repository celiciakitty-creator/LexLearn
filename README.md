# LexLearn

LexLearn is a beginner-friendly UK law learning platform covering **civil law**, **criminal law**, and **everyday legal topics**. Content focuses on the law of **England and Wales** unless a section explicitly states otherwise.

Interactive lessons, realistic scenarios, Case Spotlight and Statute Spotlight explainers, Legal Bites, quizzes, and local progress tracking help learners understand how law applies in everyday life—without replacing professional legal advice.

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
- **Legal disclaimer** on lessons, quizzes, and site footer

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
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Lint
npm run lint

# Production build
npm run build
```

## Project structure

```
app/              # Routes (home, learn, quiz, progress)
components/       # UI (home, learn, layout)
hooks/            # useProgress, useAchievements
lib/
  course/         # Module registry and lesson/quiz content
  achievements/   # Achievement definitions and evaluation
  progress/       # localStorage progress and learning levels
  legal-facts.ts  # Legal Bites content
  case-spotlights.ts
  statute-spotlights.ts
docs/             # Architecture, content plan, changelog, legal review
```

See `docs/ARCHITECTURE.md` for full technical documentation.

## Project status

| Area | Status |
|------|--------|
| All five modules | **Implemented** — lessons + quizzes |
| Ludwitt / Hult integration | **Pending** — not yet implemented |
| Database / auth | Not planned for current phase |
| Legal content review | Modules 2–5 flagged — see `docs/LEGAL_REVIEW.md` |

## Disclaimer

LexLearn provides **general educational information about UK law and is not legal advice**. For legal problems, consult a qualified professional.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Content plan](docs/CONTENT_PLAN.md)
- [Changelog](docs/CHANGELOG.md)
- [Legal review checklist](docs/LEGAL_REVIEW.md)
