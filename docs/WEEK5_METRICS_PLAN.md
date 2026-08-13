# Week 5 Metrics Plan

LexLearn reports qualifying learning events to the self-hosted **Hult/Ludwitt reference API** via a server-side proxy. OAuth sign-in remains separate; Week 5 counting uses anonymous HttpOnly cookies, not Ludwitt `sub` or PII.

## Reference API (production)

| Item | Value |
|------|--------|
| Base URL | `https://lexlearn-week5-metrics-api.vercel.app` |
| LexLearn `app_id` | `10af7f09-1664-4ccf-866c-c917dc9d9df2` |
| Cohort gate | ≥25 **qualified external users** (platform snapshot) |

## Qualification events

| Event | When LexLearn fires it | Counts toward `qualified_users` |
|-------|------------------------|----------------------------------|
| `lesson_started` | First open of a module lesson (`LessonView` mount, deduped per module per browser session) | Yes |
| `lesson_completed` | Learner clicks **Continue to quiz** (deduped per module per session) | Yes |
| `quiz_submitted` | Every real quiz submit (pass or fail) | Yes |

**Does not qualify:** homepage views, `/learn` dashboard views, feedback form views, heartbeats, page scroll alone.

## Anonymous identity (no PII)

| Cookie | Purpose | Flags |
|--------|---------|--------|
| `lexlearn_metrics_uid` | Stable anonymous learner id (UUID v4) | HttpOnly, SameSite=Lax, Secure in production, ~1 year |
| `lexlearn_metrics_sid` | Learning session id (UUID v4) | HttpOnly, SameSite=Lax, Secure in production, ~24h |

Created on first qualifying interaction at `POST /api/metrics/events`. Reused across visits (same browser). **No email, name, IP, or Ludwitt OAuth id** is sent as `user_id`.

## Server proxy

```
Browser  →  POST /api/metrics/events  { event, metadata }
         →  LexLearn server (cookies + validation)
         →  POST {HULT_METRICS_API_BASE_URL}/v1/apps/{HULT_METRICS_APP_ID}/events
              Authorization: Bearer {HULT_METRICS_DEV_API_KEY}
              { event, user_id: uid, session_id: sid, metadata }
```

Upstream credentials never reach the browser.

## Environment variables (server-only)

| Variable | Purpose |
|----------|---------|
| `HULT_METRICS_API_BASE_URL` | Reference API origin |
| `HULT_METRICS_APP_ID` | Registered LexLearn app id |
| `HULT_METRICS_DEV_API_KEY` | Developer bearer token for event ingestion |

Set these in **LexLearn Vercel** project settings (not `NEXT_PUBLIC_*`).

## Verification

```bash
npm run metrics:check
```

Prints `unique_users` and `qualified_users` from the reference API (requires env vars in `.env.local`).

### Manual Week 5 proof (local or production)

1. Confirm baseline `0 / 0` via `npm run metrics:check`.
2. Open an **incognito** browser → visit LexLearn.
3. Open **exactly one** lesson → continue to quiz optional.
4. Run `npm run metrics:check` → expect `unique_users: 1`, `qualified_users: 1`.
5. Submit a quiz in the same browser → `qualified_users` stays `1` for that uid.
6. Repeat in a second incognito window → counts should increase for a second distinct uid.

Staff snapshot: `GET /v1/admin/cohorts/{cohort_id}/snapshots/{date}` on the reference API (admin key server-side only).

## Code map

| Event | File | Hook |
|-------|------|------|
| `lesson_started` | `components/learn/lesson-view.tsx` | `useEffect` + `sessionStorage` dedupe |
| `lesson_completed` | `components/learn/lesson-view.tsx` | `handleContinue` before quiz navigation |
| `quiz_submitted` | `components/learn/quiz-view.tsx` | `handleSubmit` on every submission |
| Proxy | `app/api/metrics/events/route.ts` | Validates, cookies, forwards |
| Upstream client | `lib/metrics/upstream.ts` | Server-only fetch |
| Client helper | `lib/metrics/track-client.ts` | Fire-and-forget fetch to proxy |

## Failure behavior

If the reference API is down or env vars are missing, learners continue normally. The proxy returns `202` with `{ ok: true, tracked: false }` when forwarding fails; the client ignores errors silently.

## OAuth vs metrics

Ludwitt OAuth (`lib/ludwitt/`) is unchanged. When OAuth is configured, lessons still require sign-in for **local progress**, but Week 5 **platform metrics** use cookie-based anonymous ids independent of OAuth.
