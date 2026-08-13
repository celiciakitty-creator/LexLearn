# Deploying the reference API



Deploy this when you want a **long-lived instance** whose registrations and Week 5 metrics survive API redeploys.



The reference API persists developers, apps, and events in **Supabase Postgres**. Storage is external to the API process — redeploys do not erase qualified-user counts when Supabase credentials remain configured.



## Supabase setup (CLI — preferred)



All schema changes live in `supabase/migrations/`. Apply them with the Supabase CLI instead of pasting SQL into the dashboard.



### 1. Authenticate (one-time)



```powershell

cd execution/ludwitt-hult-api

npx supabase login

```



This opens a browser window. Do **not** paste access tokens into Cursor chat.



### 2. Choose or create a project



List your existing projects:



```powershell

npx supabase projects list

```



**Recommendation:** use a **dedicated Supabase project** for the Week 5 reference API metrics (separate from any future LexLearn app database). Do not reuse or modify an existing project without confirming first.



To create a new project via CLI (requires org id from `npx supabase orgs list`):



```powershell

npx supabase orgs list

npx supabase projects create ludwitt-hult-week5 --org-id <your-org-id> --region us-east-1

```



Or create one in the [Supabase dashboard](https://supabase.com/dashboard) and link it in the next step.



### 3. Link this repo to the project



```powershell

npx supabase link --project-ref <your-project-ref>

```



The project ref is the subdomain in `https://<project-ref>.supabase.co`.



### 4. Apply migrations



```powershell

npm run db:push

```



This runs `supabase/migrations/001_initial_schema.sql` against the linked remote project.



Verify:



```powershell

npm run db:status

```



### 5. Configure API environment

If you linked via CLI above, generate a local server `.env` (gitignored):

```powershell
npm run env:from-cli
```

Or copy `.env.example` to `.env` and set server-side values from **Project Settings → API** in the Supabase dashboard:



| Variable | Where to obtain |

|----------|-----------------|

| `SUPABASE_URL` | Project Settings → API → Project URL |

| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → `service_role` (secret) |

| `HULT_DEV_API_KEY` | Generate a long random string (your choice) |

| `HULT_DEVELOPER_HANDLE` | Your GitHub username |

| `ADMIN_KEY` | Generate a long random string (your choice) |



Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code or `NEXT_PUBLIC_*` variables.

The Postgres database password (for CLI `db push`) is stored locally in `.supabase-db-password.local` (gitignored) when the project was created via CLI.

### 6. Verify schema and run integration tests

```powershell
npm run db:verify
npm run test:integration
```

## Docker (local smoke test against Supabase)



```bash

cd execution/ludwitt-hult-api

cp .env.example .env   # fill SUPABASE_* and HULT_* values

docker compose up --build

curl http://localhost:4000/health

```



## Railway / Render / Fly (recommended for Week 5)



1. Connect repo subpath `execution/ludwitt-hult-api`

2. Build: `Dockerfile`

3. Port: `4000`

4. Set environment variables (same as step 5 above)



No persistent volume is required on the host — Postgres lives in Supabase.



## Verify persistence after deploy



```bash

# Register once, save app_id

curl -X POST https://your-api.example/v1/developer/apps \

  -H "Authorization: Bearer $HULT_DEV_API_KEY" \

  -H "Content-Type: application/json" \

  -d '{ ... }'



# After a host restart/redeploy:

curl https://your-api.example/v1/apps/{app_id}/metrics \

  -H "Authorization: Bearer $HULT_DEV_API_KEY"

```



If metrics return `404 app not found` after redeploy, the app was never written to Supabase (check credentials and that migrations were applied).



## Tests



```bash

npm test                  # unit tests — no Supabase required

npm run test:integration  # requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env

```



## Hardening beyond the pilot



- [x] Replace in-memory store with durable Postgres (Supabase)

- [ ] Load the real cohort roster into `blocked_user_ids` (placeholders ship by default)

- [ ] Authenticate admin snapshot route in all environments

- [ ] HTTPS on a domain you control

- [ ] Per-student developer keys instead of shared demo fallbacks



See [README.md](README.md) and [.env.example](.env.example).

