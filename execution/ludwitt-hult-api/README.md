# Ludwitt/Hult Platform API — reference implementation

**Read this before you integrate anything.** This package is a *reference implementation* of the platform contract, not a hosted service. Nothing in this directory runs at a public URL that we operate.

> **Removed on 2026-08-07:** earlier versions of these docs published base URLs of `https://api.ludwitt.hult/v1` and `https://sandbox.api.ludwitt.hult/v1`. **Those hosts have never existed** — `.hult` is not a real top-level domain. Participants in the Summer Pilot lost hours of Week 4 to that mistake, some of them standing up their own copy of this server to have something to integrate against. If you find `.hult` in any doc, it is stale; report it.

---

## Which platform do I integrate with?

Two paths exist. **Both counted for Summer Pilot Week 4** (ruled 2026-08-07). Pick with open eyes.

`www.ludwitt.com` and `pitchrise.ludwitt.com` serve the **same deployment** (verified 2026-08-08: identical Vercel deployment id on both hosts). `/developers` is one portal reachable at either domain — they are not two systems, and an app registered through one is the same app at the other.

| | Hosted platform | Reference API (this package) |
|---|---|---|
| **Where** | https://www.ludwitt.com/developers (= pitchrise.ludwitt.com/developers) | Wherever you run it — localhost or your own deploy |
| **Registration** | Real developer portal, app queued for review | `POST /v1/developer/apps` against your instance |
| **App ID looks like** | `le_aa66000f7ab45563e7b4dd` | a UUID |
| **Auth** | OAuth 2.0 + PKCE | Bearer `api_key`, HS256 launch JWT |
| **API host** | `pitchrise.ludwitt.com` | your instance |
| **Catch** | Portal access is gated, and live OAuth stays off until staff approve your app | Supabase-backed store — metrics survive API redeploys |

**The hosted portal is gated.** At least one participant hit an "Unlock Developer Portal" wall demanding 5 ALC Projects (0/5) and Deployment Verified (0/1), with a **$10,000 bypass** offered as the alternative. **Do not pay it.** If the portal will not open for you, say so in your pull request and in Discord, and use the reference API instead. That is an accepted path, not a fallback you will be penalised for.

If the portal *does* open, expect your app to sit "In review" before live OAuth works. Verify through Test Mode meanwhile and document what Test Mode did and did not prove.

---

## What Ludwitt actually publishes

Sourced 2026-08-08 from Ludwitt's own agent files — [llms.txt](https://pitchrise.ludwitt.com/llms.txt) and [llms-full.txt](https://pitchrise.ludwitt.com/llms-full.txt). These are public, machine-readable, and authoritative. Read them before trusting anything in this repo.

**"For Developers Building on Ludwitt"**, verbatim in substance:

| | |
|---|---|
| API base URL | `https://pitchrise.ludwitt.com/api/` |
| Authentication | Firebase ID token in the `Authorization` header (routes validate via Firebase Admin SDK) |
| Rate limit | 100 requests/minute, authenticated |
| Webhooks | Zapier-compatible: progress updates, achievement unlocks, subscription changes, credit transactions |
| LMS | Custom API integration available now; LTI 1.3 and SCORM planned |

**There is no public app-submission or app-directory programme.** Ludwitt's sitemap lists 27 public pages and exactly one developer page, `/alc`. Nothing published describes submitting an app for listing. So when our PR template asks for a "production listing URL", that means **your own deployed application URL** — not a URL on a Ludwitt directory, which does not exist publicly.

**The `/developers` portal is unlocked by the ALC track, not by paying.** Ludwitt's Developer Training (AI Learning Center) track is a 19-step journey: 3 shared setup steps, 5 steps on a chosen path (Cursor, Claude Code, or OpenClaw), then 11 shared post-path steps including an open-source PR to cursorboston.com, a Loom showcase video, and a 5-year technology vision document. The portal's "5 ALC Projects / Deployment Verified" counters track that work. A $10,000 bypass is offered alongside it. **Nobody in this cohort should pay it** — if the portal will not open, use the reference API and say so in your pull request.

Everything the gated portal exposes beyond this — OAuth 2.0 with PKCE, `le_…` client IDs, `/api/oauth/authorize`, `/api/oauth/userinfo`, the hosted-data API at `PUT /api/v1/data/{collection}/{doc}`, the `profile` / `credits:read` / `credits:spend` scopes, and the "In review" queue with Test Mode — is real but undocumented publicly. We know it because Summer Pilot participants integrated against it and pasted their actual requests and responses into merged pull requests (#256, #257, #258).

---

## Running the reference API

```bash
cd execution/ludwitt-hult-api
npm install
npm run dev          # http://localhost:4000
curl http://localhost:4000/health
```

Requires **Node.js 20+**.

Base URL is `<your-instance>/v1`. Locally that is `http://localhost:4000/v1`.

### Persistence (Supabase Postgres)

`src/supabase.js` + `src/supabase-store.js` persist developers, apps, credentials, events, and blocklist entries in **Supabase Postgres**. The API uses the **service role key** server-side only — never in browser code.

| Variable | Required | Purpose |
|----------|----------|---------|
| `SUPABASE_URL` | Yes (production) | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (production) | Server-side database access |
| `HULT_DEV_API_KEY` | Recommended | Production developer bearer token for `/v1/*` routes |
| `HULT_DEVELOPER_HANDLE` | Recommended | Handle used for anti-gaming self-block (exact match) |
| `ADMIN_KEY` | Recommended (prod) | Protects admin CSV snapshot export |

**Local development:** copy `.env.example` to `.env`, then set up Supabase via CLI (see [DEPLOY.md](DEPLOY.md)):

```powershell
cd execution/ludwitt-hult-api
npx supabase login
npx supabase link --project-ref <your-project-ref>
npm run db:push
```

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from Project Settings → API.

**Unit tests** (`npm test`) use an in-memory test store and do not require Supabase credentials.

**Integration tests** (`npm run test:integration`) require live Supabase credentials.

Three habits that still matter:

1. **Deploy one long-lived instance** connected to Supabase.
2. **Record `app_id`, `api_key`, and `jwt_secret` the moment registration returns them.** Put the app ID in your PR body; put secrets in host environment variables, never in git.
3. **Set `HULT_DEV_API_KEY` and `HULT_DEVELOPER_HANDLE` in production** instead of relying on shared demo credentials.

### Developer credentials

On startup the server seeds (idempotent upsert):

| Key | Sandbox | Purpose |
|-----|---------|---------|
| `sandbox_key_demo` | yes | Local/testing — events not stored |
| `HULT_DEV_API_KEY` or `prod_key_demo` | no | Production event ingestion |

These authenticate `/v1/developer/*`, event ingestion, and metrics routes. They are **not** the per-app `api_key` returned at registration (that value is stored but not used for route auth in this reference implementation).

---

## Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /v1/developer/apps` | Register an app → `app_id`, `api_key`, `jwt_secret` |
| `POST /v1/auth/launch-token` | Issue a launch JWT for a user + app |
| `POST /v1/apps/{app_id}/events` | Ingest learning events |
| `GET /v1/apps/{app_id}/metrics` | Unique and qualified user counts |
| `GET /v1/admin/cohorts/{cohort_id}/snapshots/{date}` | CSV export for staff |
| `GET /health` | Liveness |

All `/v1` routes except `/health` require `Authorization: Bearer {api_key}`. Launch JWTs are HS256, signed with the app's own `jwt_secret`. Contract: [openapi.yaml](openapi.yaml).

**Event types:** `lesson_started`, `lesson_completed`, `quiz_submitted`, `session_heartbeat`.

A user producing only heartbeats does not qualify. At least one non-heartbeat event per session is what makes a session count.

---

## What the user count does and does not gate

**Week 4 (learning app) has no user-count condition.** It was removed on 2026-08-04. The ≥25 figure came from the original eight-week calendar, where the learning app sat in week 6 with a snapshot on Fri Aug 19 — carrying it onto a six-day build week turned a two-and-a-half-week adoption target into an impossible one. Week 4's bar is the integration: a registered app, a working launch flow, events landing.

**Week 5 (venture) does carry a ≥25 external-user gate**, measured from the platform snapshot. See [assessment/metrics.md](../../assessment/metrics.md) and [assessment/pass-fail.md](../../assessment/pass-fail.md).

Cohort member user IDs do not count. User IDs that **exactly match** your developer handle (`HULT_DEVELOPER_HANDLE`) do not count. The roster blocklist in Supabase ships with placeholder IDs.

---

## Status and gaps

This is pilot-grade. Known gaps, stated so nobody plans around them:

- **Supabase Postgres persistence** — metrics survive API redeploys when connected to Supabase (see [DEPLOY.md](DEPLOY.md)).
- **Shared developer fallback keys** — set `HULT_DEV_API_KEY` in production.
- **Roster blocklist is a placeholder** (`cohort-member-1`, `cohort-member-2`).
- **No directory listing.** The app directory referenced in the student integration spec does not exist here; a "production listing URL" means your own deployed app URL.
- **Admin snapshot route is weakly protected** in non-production. Set `ADMIN_KEY` in production.

Student-facing integration steps: [integration-spec.md](../../curriculum/phase-2/project-1-learning-app/integration-spec.md) · Deploying: [DEPLOY.md](DEPLOY.md) · Quickstart: [DEVELOPER.md](DEVELOPER.md)
