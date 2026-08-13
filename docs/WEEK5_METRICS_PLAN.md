# Week 5 Metrics Plan

LexLearn will eventually report learning events to the Ludwitt/Hult cohort reference API (`lesson_started`, `lesson_completed`, `quiz_submitted`). **No tracking is implemented in this update** — this document maps where events should fire after the reference API is reviewed.

## Qualification events (from cohort spec)

| Event | When to fire | Minimum bar |
|-------|--------------|-------------|
| `lesson_started` | User opens a module lesson | Counts toward user qualification |
| `lesson_completed` | User finishes a lesson (explicit completion) | Counts toward user qualification |
| `quiz_submitted` | User submits a module quiz | Counts toward user qualification |

Page views, homepage visits, and scrolling do **not** qualify. Cohort metrics require server-side events tied to a platform-issued `user_id` and `session_id`.

## Current code locations

### `lesson_started`

**Best hook:** when a learner actually begins a lesson view.

| Location | File | Trigger today |
|----------|------|---------------|
| Lesson mount | `components/learn/lesson-view.tsx` | `useEffect` calls `touchModule(lesson.moduleId, {})` on mount — updates `lastVisited` in localStorage only |
| Route entry | `app/learn/[moduleId]/page.tsx` | Server renders `LessonView` after auth gate |

**Recommended future trigger:** server-side event in `app/learn/[moduleId]/page.tsx` or a dedicated API route called once per session when `LessonView` mounts, using platform JWT `sub` as `user_id`.

**Gap:** `touchModule` fires on every remount/navigation; dedupe by `session_id` + `moduleId` will be needed server-side.

### `lesson_completed`

**Best hook:** when the learner marks a lesson complete.

| Location | File | Trigger today |
|----------|------|---------------|
| Continue to quiz | `components/learn/lesson-view.tsx` | `handleContinue` → `completeLesson(lesson.moduleId)` via link `onClick` to `/quiz/{moduleId}` |
| Storage | `lib/progress/storage.ts` | `markLessonComplete()` sets `lessonCompleted: true` |

**Note:** Completion currently happens when the user clicks **Continue to quiz**, not when they scroll to the end. That is a reasonable proxy for “finished reading” but should be documented for metrics consistency.

**Also sets `lessonCompleted` on quiz pass:** `markQuizComplete()` in `lib/progress/storage.ts` sets `lessonCompleted: true` again — do not double-fire `lesson_completed` if already sent at continue-click.

### `quiz_submitted`

**Best hook:** when the user submits answers (regardless of pass/fail).

| Location | File | Trigger today |
|----------|------|---------------|
| Submit handler | `components/learn/quiz-view.tsx` | `handleSubmit()` → `setSubmitted(true)`, `recordQuizAttempt(finalScore)` |
| Pass only | `components/learn/quiz-view.tsx` | `completeQuiz()` only if `finalScore >= quiz.passThreshold` |

**Recommended future trigger:** fire `quiz_submitted` on every submit in `handleSubmit`, not only on pass. Pass/fail can live in event `metadata`.

## Anonymous and external users today

| Identity source | Where | Stable ID? |
|-----------------|-------|------------|
| **None (anonymous)** | Default when Ludwitt OAuth not configured or user not signed in | No platform `user_id` — only browser localStorage |
| **Ludwitt OAuth `sub`** | `lib/ludwitt/session.ts` → `/api/auth/me` | Stable per Ludwitt account when signed in |
| **localStorage progress** | `lexlearn-course-progress-v1` | Device-local only; not suitable as cohort `user_id` |

### Issues for stable external user IDs

1. **Anonymous learners** have no server-known identity — Week 5 counting requires users entering via the platform launcher with a JWT (`sub` in payload per Hult integration spec).
2. **Pitchrise OAuth `sub`** and **Hult JWT `sub`** may be different surfaces — confirm with cohort staff whether OAuth sign-in satisfies the launcher requirement or if a separate `/launch?token=` flow is mandatory.
3. **localStorage progress** cannot be used to dedupe users across devices or attribute events to platform roster.
4. **Auth gates** (`components/learn/ludwitt-auth-gate.tsx`) require sign-in when OAuth is configured, but signed-in users are still not linked to Hult metrics until JWT launch + events API exist.

## Recommended implementation order (after API review)

1. Add `/launch` route — validate Hult JWT, establish server session with platform `user_id`.
2. Create `lib/metrics/events.ts` — typed client for `POST /v1/apps/{app_id}/events`.
3. Fire `lesson_started` once per lesson session (dedupe in session cookie or server).
4. Fire `lesson_completed` from `completeLesson` path (client calls server route; server forwards event).
5. Fire `quiz_submitted` from `handleSubmit` (always, not only on pass).
6. Never count page views or localStorage-only actions.

## Components to touch later

| Component / module | Event |
|--------------------|-------|
| `components/learn/lesson-view.tsx` | `lesson_started`, `lesson_completed` |
| `components/learn/quiz-view.tsx` | `quiz_submitted` |
| `lib/progress/storage.ts` | Optional central hook point (prefer explicit calls in views to avoid storage-layer side effects) |
| New: `app/launch/route.ts` or `app/launch/page.tsx` | JWT validation, session bootstrap |
| New: `app/api/metrics/events/route.ts` | Server-side proxy to Hult API (keeps `api_key` secret) |
| `lib/ludwitt/session.ts` | May supply `user_id` if OAuth and Hult IDs align — confirm first |

## Why page views alone should not count

Cohort pass gates require **qualified users** with at least one non-heartbeat learning event (`lesson_started`, `lesson_completed`, or sustained `session_heartbeat`). Raw traffic:

- Can be bots, cohort members (blocklisted), or accidental clicks.
- Does not prove engagement with learning content.
- Cannot be verified server-side if fired only from the browser without platform auth.

Server-side events with platform-issued `user_id` are the canonical metric per `hult-cohort-program` integration spec.

## Out of scope for this document

- Feedback persistence (`/api/feedback`) — separate backend decision.
- Ludwitt AI credit proxy — unrelated to cohort user counts.
- Fake counters or client-side “user count” UI — intentionally not added.
