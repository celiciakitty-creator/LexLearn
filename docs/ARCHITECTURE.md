# LexLearn Architecture

LexLearn is a beginner-friendly UK law learning platform built with **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui** (Base UI). Progress and achievements are stored in the browser via `localStorage`; there is no backend or Ludwitt integration yet.

## High-level structure

```
app/                    # Next.js routes
components/
  home/                 # Homepage sections
  learn/                # Learning UI (lessons, quizzes, progress widgets)
  layout/               # Shell, header, disclaimer
hooks/                  # Client hooks (progress, achievements)
lib/
  achievements/         # Achievement definitions and evaluation
  course/               # Module registry, lesson/quiz content, unlock logic
  progress/             # localStorage progress + learning levels
  case-spotlights.ts    # Case Spotlight content
  legal-facts.ts        # Legal Bites content
  homepage-data.ts      # Static homepage copy
  navigation.ts         # Site nav + legal disclaimer
public/images/          # Static assets (floral banner)
docs/                   # Project documentation
```

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage — hero, features, Legal Bites, Case Spotlight, progress, modules, Why Learn UK Law |
| `/learn` | Module list, Legal Bites carousel, Case Spotlight |
| `/learn/[moduleId]` | Lesson view (Module 1 implemented) |
| `/quiz/[moduleId]` | Module quiz (Module 1 implemented) |
| `/progress` | Learning level, achievements, module breakdown |

## Course model

- **Three subject categories:** Civil Law, Criminal Law, Everyday Law
- **All five modules** have full lesson + quiz content in `lib/course/content/`
- **Unlock rule:** Module 1 always available; later modules unlock when the previous module quiz is passed (≥ pass threshold)
- **Progress shape:** `CourseProgress` in `lib/course/types.ts` — per-module lesson/quiz flags plus `totalCorrectAnswers` for achievements

## Client state

### Progress (`lexlearn-course-progress-v1`)

- Read/write: `lib/progress/storage.ts`
- Hook: `hooks/use-progress.ts` — `useSyncExternalStore` with cached snapshots and `lexlearn-progress-change` events
- Mutations: `completeLesson`, `completeQuiz`, `touchModule`, `recordQuizAttempt`

### Achievements (`lexlearn-achievements-v1`)

- Definitions: `lib/achievements/types.ts`
- Evaluation: `lib/achievements/index.ts` — synced automatically on progress writes
- Hook: `hooks/use-achievements.ts`

### Learning levels

- Defined in `lib/progress/levels.ts`
- Derived from completed module count via `getLevelProgress()` / `getCourseSummary()`

## Reusable learning components

| Component | File | Role |
|-----------|------|------|
| `CaseSpotlightCard` | `components/learn/case-spotlight.tsx` | Real-world case explainer |
| `LegalBites` | `components/learn/legal-bites.tsx` | Categorised legal facts with carousel |
| `AchievementCard` | `components/learn/achievement-card.tsx` | Single achievement display |
| `AchievementsSection` | `components/learn/achievements-section.tsx` | Progress page achievement grid |
| `LearningLevelCard` | `components/learn/learning-level-card.tsx` | Level title + progress to next level |
| `StatuteSpotlightCard` | `components/learn/statute-spotlight.tsx` | Statute explainer (e.g. CRA 2015) |
| `LessonView` / `QuizView` | `components/learn/` | Core learning flows |

## Design system

Brand tokens in `app/globals.css`: `lex-navy`, `lex-pale`, `lex-surface`, `lex-gold`. Headings use Playfair Display (`font-serif`); body uses Geist Sans.

## SSR / hydration

- Progress and achievement hooks use stable server snapshots to avoid hydration loops
- Hero LCP image is a server component (`hero-banner-image.tsx`) with `priority` preload

## Not yet implemented

- Ludwitt / Hult JWT launch and event tracking
- Modules 2–5 lesson and quiz content
- Backend or cross-device sync
- Authentication
