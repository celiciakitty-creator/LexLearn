# LexLearn — Business Plan (Week 5 Venture Documentation)

**Document status:** Early-stage venture draft for Hult Summer Pilot 2026, Week 5  
**Last updated:** August 2026  
**Scope:** England and Wales beginner UK law education (early-access pilot)

---

## How to read this document

| Label | Meaning |
|-------|---------|
| **Verified** | Supported by the LexLearn repository, deployed product, or metrics API checks described below |
| **Assumption / hypothesis** | Directional thinking not yet validated with market data or financial results |
| **Future target** | Planned outcome, not yet achieved |

This plan does **not** invent market statistics, revenue, paying customers, partnerships, investor conversations, conversion rates, or quantitative pilot feedback beyond what is verified.

---

## 1. Executive summary

**Verified:** LexLearn is a production web application at **https://lex-learn-ten.vercel.app/** offering beginner-friendly UK law learning across **Civil Law**, **Criminal Law**, and **Everyday Law**, focused on **England and Wales**. The product includes **five live modules** with lessons, quizzes, progress tracking, achievements, Legal Bites, Case Spotlight, and Statute Spotlight content. The app reports qualifying learning events to a self-hosted **Hult/Ludwitt reference metrics API** backed by Supabase.

**Verified (Week 5 traction gate):** LexLearn has reached **25 unique users** and **25 qualified external users**, verified through the reference API (`npm run metrics:check` against `https://lexlearn-week5-metrics-api.vercel.app`).

**Assumption / hypothesis:** There is demand among young people and early-stage law learners for plain-language, scenario-based legal education that feels approachable rather than like traditional legal marketing or dense textbooks.

**Future target:** Convert early pilot traction into a sustainable learning product with accounts, richer content, and optional professional review—while maintaining clear educational (non-advice) positioning.

---

## 2. Problem

Many people encounter legal concepts—contracts, negligence, criminal responsibility, consumer rights—before they have formal legal training. Existing resources often:

- Assume prior legal vocabulary or institutional context
- Present law as abstract doctrine rather than everyday situations
- Feel intimidating, expensive, or disconnected from real decisions (shopping, work, housing, disputes)

**Verified (product positioning in repo):** LexLearn’s homepage and course copy explicitly target learners who want UK law “explained clearly — not like a law firm brochure,” with **no prior legal knowledge required**.

**Assumption / hypothesis:** A meaningful segment of young people and prospective law students will engage with structured, bite-sized legal learning if the tone, pacing, and visuals reduce intimidation.

---

## 3. LexLearn solution

LexLearn is a **browser-based learning platform** that combines:

- **Structured modules** with sequential unlock (quiz pass required)
- **Scenario-led lessons** with objectives, key terms, embedded knowledge checks, and takeaways
- **Module quizzes** (five multiple-choice questions; pass threshold **3/5** with immediate explanations)
- **Legal Bites** — categorised short legal facts with review-status badges
- **Case Spotlight** — beginner-oriented case/scenario explainers linked to modules
- **Statute Spotlight** — statute explainers (e.g. Consumer Rights Act 2015 in Module 5)
- **Progress dashboard**, **learning levels**, and **achievements** (browser-local)
- **Pilot journey UX** — optional external survey → try a lesson/quiz → native feedback form

**Verified:** Content disclaimer states LexLearn provides **general educational information, not legal advice** (site footer, lessons, quizzes).

---

## 4. Current product (verified from repository)

### 4.1 Learning path

| # | Module | Category | Status |
|---|--------|----------|--------|
| 1 | Contracts in Everyday Life | Civil Law | **Live** |
| 2 | Negligence and Duty of Care | Civil Law | **Live** |
| 3 | Crime: Acts, Intent and Responsibility | Criminal Law | **Live** |
| 4 | Assault, Self-Defence and Weapons | Criminal Law | **Live** |
| 5 | Your Everyday Legal Rights | Everyday Law | **Live** |

**Verified:** Unlock order is Module 1 → 2 → 3 → 4 → 5; each subsequent module unlocks when the previous module quiz is passed.

### 4.2 Learning levels (verified)

Legal Beginner → Legal Explorer → Case Analyst → Rights Advocate → LexLearn Scholar (based on completed module count).

### 4.3 Achievements (verified)

First Lesson, First Quiz, Civil Law Started, Criminal Law Started, Five Correct Answers — stored in browser `localStorage`.

### 4.4 Homepage & pilot surfaces (verified)

Hero, feature strip, “How LexLearn works,” audience section, learning areas, featured Legal Bite, Case Spotlight, progress widget, module list, pilot CTA, “Why Learn with LexLearn?,” “Why Learn UK Law?,” native feedback form (`/#feedback`), optional external survey CTA when configured.

### 4.5 Routes (verified)

`/`, `/learn`, `/learn/[moduleId]`, `/learn/pilot`, `/quiz/[moduleId]`, `/progress`, `/api/feedback`, `/api/metrics/events`, Ludwitt OAuth routes (`/auth/login`, `/auth/callback`, etc.).

### 4.6 What is not yet productised (verified gaps)

- Ludwitt AI credit proxy / assistive Q&A
- Hult cohort JWT launch flow (separate from current Week 5 cookie-based metrics)
- Cross-device progress sync (progress is local to browser)
- Full legal review sign-off for all modules (`docs/LEGAL_REVIEW.md` checklist largely open)
- Production Ludwitt OAuth callback registration noted as a deployment dependency in README

---

## 5. Target users

**Verified (homepage audience cards):**

1. **Curious young people** — understand everyday rights without legal background  
2. **Prospective law students** — explore UK law in plain language before formal study  
3. **Current students** — refresh civil, criminal, and practical topics with bite-sized lessons and quizzes  
4. **Everyday learners** — learn how law can affect shopping, work, housing, and ordinary life  

**Assumption / hypothesis:** The initial wedge is **16–24-year-olds** in the UK (and adjacent markets) who are curious about rights or considering law-related study, rather than qualified practitioners seeking CPD.

---

## 6. User personas (working drafts)

### Persona A — “Curious Year 12” (hypothesis)

- **Goal:** Understand consumer and contract basics before university  
- **Pain:** Textbooks feel dense; free online content feels unreliable  
- **LexLearn fit:** Module 1 & 5 scenarios, quizzes, Legal Bites  

### Persona B — “Prospective law applicant” (hypothesis)

- **Goal:** Build confidence with legal concepts before LLB/GDL  
- **Pain:** Unclear where to start; fears looking uninformed  
- **LexLearn fit:** Structured five-module path, Case Spotlight, learning levels  

### Persona C — “Everyday decision-maker” (hypothesis)

- **Goal:** Know when a situation might have legal dimensions (refunds, disputes, housing)  
- **Pain:** Does not want to pay for advice for basic orientation  
- **LexLearn fit:** Everyday Law module, disclaimers, scenario explanations  

*Persona details are illustrative hypotheses aligned with homepage positioning—not derived from demographic analytics.*

---

## 7. Market opportunity

**Assumption / hypothesis:** The addressable need is **legal literacy for non-lawyers** in the UK, starting with England and Wales foundational topics (civil, criminal, everyday rights).

**Deliberately omitted:** TAM/SAM/SOM figures, market size citations, and growth rates — no verified market research is in the repository.

**Directional opportunity statement (hypothesis):** If even a small fraction of UK secondary students, college students, and early-career adults seek approachable legal learning each year, a focused beginner product could serve an underserved gap between social media snippets and formal qualifications.

---

## 8. Competitor and alternative analysis (qualitative)

| Alternative | Strengths | LexLearn differentiation (hypothesis) |
|-------------|-----------|--------------------------------------|
| Law textbooks & revision guides | Authoritative, exam-aligned | LexLearn emphasises scenarios, interactivity, and plain language for non-exam beginners |
| MOOCs / general learning platforms | Brand reach, video production | LexLearn is UK-law-specific, modular, and pilot-sized for focused iteration |
| Free video / article content | Zero cost, wide coverage | LexLearn offers structured path, quizzes, progress, and consistent pedagogical design |
| Professional legal advice | Tailored to facts | LexLearn is educational only—not a substitute; clear disclaimers |
| School PSHE / citizenship materials | Institutional distribution | *Assumption / hypothesis:* LexLearn could complement formal curricula — not verified or pursued |

**Verified constraint:** LexLearn does not provide legal advice and must not be positioned as doing so.

---

## 9. Value proposition

**Verified tagline (repository):** *Learn. Understand. Apply.*

**Verified hero promise:** *A simpler way to understand UK law and your everyday legal rights.*

**Core value pillars (verified in product):**

- **Accessible** — no prior legal knowledge required  
- **Structured** — five-module path with checks for understanding  
- **Practical** — scenarios linked to everyday life  
- **Transparent** — educational disclaimer on factual content  
- **Low friction pilot** — anonymous learning path available without sign-in for core pilot flow  

---

## 10. Business model

**Assumption / hypothesis (not yet validated):** LexLearn could pursue one or a combination of:

| Model | Description | Status |
|-------|-------------|--------|
| **B2C subscription** | Monthly/annual access to expanded modules and features | Hypothesis |
| **Freemium** | Free starter path; paid advanced modules or tools | Hypothesis |
| **B2B / institutional** | Licences for schools, colleges, access programmes | Hypothesis — no institutional customers verified |
| **Platform integration** | Technical integration with education or legal-tech ecosystems (e.g. Ludwitt/Hult) | Exploratory — OAuth/metrics integration exists in code; no commercial partnership verified |

**Verified today:** No payment flow, pricing page, or billing integration in the repository.

---

## 11. Pricing hypothesis

**Assumption / hypothesis (unvalidated):**

- **Student / individual tier:** £5–£12 per month or £40–£80 per year for full library access (placeholder range for modelling only)  
- **Institutional pilot:** Custom per-seat pricing for schools — requires sales discovery  
- **Free tier:** Module 1 or limited modules always free to support acquisition  

No pricing has been tested with paying users. Any financial projections using these figures are **sensitivity assumptions**, not forecasts.

---

## 12. Go-to-market strategy

### Phase 1 — Pilot validation (current — verified)

- Deploy production app  
- Drive learners through pilot journey (optional survey → lesson/quiz → feedback)  
- Measure qualified usage via reference metrics API  
- Collect qualitative product survey input and native feedback  

### Phase 2 — Iteration (future target)

- Ship top-requested UX/content improvements from survey themes (see §16)  
- Complete legal content review for modules 2–5  
- Introduce accounts and cross-device progress  

### Phase 3 — Scale (future target — hypothesis)

- Reach law-adjacent student communities through content-led discovery  
- Content marketing grounded in Legal Bites / Case Spotlight  
- Explore institutional or partnership channels only after product-market signal — **none verified or pursued to date**

**Assumption / hypothesis:** Word-of-mouth and cohort/community distribution (Hult pilot, student networks) are the lowest-cost early channels before paid acquisition.

---

## 13. Customer acquisition

**Verified (current):**

- Production URL: **https://lex-learn-ten.vercel.app/**
- Week 5 pilot homepage with CTA to `/learn/pilot` and Module 1
- Optional external survey via `NEXT_PUBLIC_LEXLEARN_SURVEY_URL` when configured

**Assumption / hypothesis (future):**

- Short-form content repurposing Legal Bites  
- SEO for beginner UK law topics (England & Wales)  
- Referral incentives once accounts exist  

*School, college, or institutional outreach is not verified and is not claimed as completed.*

**Deliberately omitted:** CAC, conversion rates, channel ROI — not measured or verified.

---

## 14. Product roadmap

Prioritised from **verified codebase state**, **external product survey themes**, and **pilot UX goals**. Items marked *hypothesis* require validation.

| Horizon | Initiative | Rationale |
|---------|------------|-----------|
| **Near** | Legal review completion (Modules 2–5) | Verified open checklist in `docs/LEGAL_REVIEW.md` |
| **Near** | Pilot feedback persistence in production | Supabase backend implemented in code; production env configuration may vary |
| **Near** | Visual assets / pictures & graphics | Repeated survey theme (see §16) |
| **Mid** | Index / glossary / highlighted navigation for long lessons | Survey theme |
| **Mid** | Additional learning activities (beyond MCQ) | Survey theme |
| **Mid** | Input from qualified legal professionals | Survey theme; aligns with legal review process |
| **Mid** | User accounts & resume training across devices | Survey theme; OAuth scaffolding exists |
| **Mid** | AI / assistive support for learner questions | Survey theme; Ludwitt credit proxy **not implemented** |
| **Long** | Expanded module library & categories | Content plan extensible beyond five modules |
| **Long** | Institutional admin / reporting | B2B hypothesis |

**Future target:** Hult JWT launch integration and learning events via cohort platform spec — documented as pending in architecture docs, separate from current cookie-based metrics proxy.

---

## 15. Technology and operations

### 15.1 Stack (verified)

- **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, **Framer Motion**  
- Browser **`localStorage`** for progress and achievements  
- **Vercel**-oriented deployment pattern (per README)  

### 15.2 Week 5 metrics architecture (verified)

- Client → `POST /api/metrics/events` → reference API  
- Anonymous HttpOnly cookies: `lexlearn_metrics_uid`, `lexlearn_metrics_sid`  
- Qualifying events: `lesson_started`, `lesson_completed`, `quiz_submitted`  
- Reference API: `https://lexlearn-week5-metrics-api.vercel.app`  
- LexLearn `app_id`: `10af7f09-1664-4ccf-866c-c917dc9d9df2`  
- Verification CLI: `npm run metrics:check`  

### 15.3 Feedback architecture (verified in code)

- Native form: `components/home/feedback-section.tsx`  
- Validation: `lib/feedback/validation.ts`  
- Persistence abstraction with Supabase option (`FEEDBACK_PERSISTENCE_BACKEND=supabase`)  
- No PII fields in feedback schema  

### 15.4 Operations (verified / hypothesis)

| Area | Status |
|------|--------|
| Hosting | Production app live at **https://lex-learn-ten.vercel.app/** |
| Content updates | TypeScript content modules in repo |
| Legal QA | Manual checklist — incomplete |
| Support | No dedicated support desk verified |
| Analytics | Reference API user/qualification counts only |

---

## 16. Current traction

### 16.1 Verified quantitative traction

| Metric | Value | Source |
|--------|-------|--------|
| Production URL | **https://lex-learn-ten.vercel.app/** | Deployed application |
| Unique users | **25** | Hult/Ludwitt reference metrics API |
| Qualified external users | **25** | Hult/Ludwitt reference metrics API |
| Live learning modules | **5** | `lib/course/modules.ts` |
| Subject areas | **3** (Civil, Criminal, Everyday) | Verified |
| External product survey responses | **22** | External product survey (qualitative themes only; not stored in LexLearn repo) |

**Note:** These metrics figures must not be altered or fabricated. Re-verify before external submission with `npm run metrics:check`.

### 16.2 Qualitative product survey themes (from 22 responses)

From the **22-response external product survey** (qualitative themes only—not aggregated in-repo; demographic and methodology details not recorded here):

1. **Pictures / graphics** — learners want richer visual support  
2. **Learning and understanding support** — stronger scaffolding for comprehension  
3. **Input / features from qualified legal professionals** — credibility and accuracy signals  
4. **Highlighted index for long material** — navigation within lengthy lessons  
5. **Index / glossary** — quick reference for legal terms  
6. **Learning activities** — beyond reading and single quiz format  
7. **AI / assistive support for questions** — on-demand help while learning  
8. **User accounts and access to previous training** — continuity across sessions/devices  

### 16.3 Native pilot feedback (verified capability; limited quantitative claims)

**Verified:** Homepage feedback form collects activities tried, clarity rating, star rating, would-use-again, and optional improvement text after pilot activity.

**Verified:** Code supports Supabase persistence when configured.

**Not claimed:** Aggregate counts, sentiment scores, or recovery of **lost website feedback submissions**—those submissions are **not** represented as stored or recovered in this plan.

### 16.4 Engagement definition (verified)

A **qualified external user** is counted when the reference API receives qualifying learning events (lesson start/complete, quiz submit) from a distinct anonymous user id—not from homepage views or feedback form views alone (`docs/WEEK5_METRICS_PLAN.md`).

---

## 17. Pilot feedback and findings (synthesis)

| Finding | Type |
|---------|------|
| Learners will complete structured lesson + quiz flows in a pilot setting | **Verified** (25 qualified users) |
| Anonymous, low-friction access supports Week 5 counting | **Verified** (metrics design) |
| Visual and navigational aids are priority asks | **Survey theme** |
| Professional legal input valued for trust | **Survey theme** |
| Accounts and continuity matter for repeat use | **Survey theme** |
| Assistive Q&A is desired; not yet shipped | **Survey theme** + **verified gap** in codebase |
| Legal content requires formal review before scale | **Verified** (legal review checklist) |

---

## 18. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| **Educational content inaccuracy** | Legal review checklist; disclaimers; mark Legal Bites needing review |
| **Misinterpretation as legal advice** | Persistent “not legal advice” messaging; no personalised guidance features |
| **Limited retention without accounts** | Roadmap: accounts + cross-device progress (survey-driven) |
| **Platform dependency (Ludwitt/Hult)** | Metrics and OAuth abstracted; core content usable standalone |
| **Unvalidated business model** | Continue pilot; defer paid pricing until repeat usage signals |
| **Content scale bottleneck** | Modular content architecture; professional input workflow (planned) |
| **Data loss / feedback gaps** | Supabase persistence for native feedback; do not rely on unrecovered submissions |
| **OAuth deployment friction** | Pilot path works without sign-in; OAuth optional |

---

## 19. Financial assumptions (illustrative only — not verified results)

**All figures below are planning placeholders only—not actuals, not projections to report, and not supported by trading data.**

| Assumption (placeholder) | Example for internal modelling only |
|------------|---------------------|
| Year 1 paying users | *Hypothesis:* 200–1,000 **if** a subscription were launched |
| ARPU (monthly) | *Hypothesis:* £8/month blended |
| Year 1 revenue | *Hypothesis:* £0–£96k depending on launch timing and conversion — **unvalidated** |
| Hosting & infra | Low tens £/month at pilot scale (Vercel + Supabase) — order-of-magnitude estimate |
| Content/legal review cost | Primary non-engineering cost driver—amount **to be confirmed** |
| Team | Founder/student venture — no verified payroll structure |

No revenue, paying customers, or financial outcomes are verified. Sensitivity analysis and formal financial model **not included**.

---

## 20. Twelve-month goals (future targets)

| Goal | Target type |
|------|-------------|
| Maintain accurate, reviewed core curriculum (5+ modules) | Future target |
| Launch accounts with cross-device progress | Future target |
| Ship glossary/index and enhanced visuals | Future target |
| Pilot assistive Q&A with appropriate safeguards | Future target |
| Complete legal review sign-off for published modules | Future target |
| Establish repeatable acquisition channel (1–2 focused segments) | Hypothesis |
| Define validated pricing with first paid cohort | Hypothesis |
| Expand qualified learner base beyond Week 5 gate | Future target — **no new user count fabricated here** |

---

## 21. Funding and use of funds (concept)

**Investor ask:** **To be confirmed.**

**Verified:** No investor engagement has been completed to date.

**Conceptual use of funds (hypothesis — contingent on future funding decision):**

1. **Content & legal quality** — professional legal review, illustration, scenario design  
2. **Product development** — accounts, glossary/index, activities, assistive features  
3. **Go-to-market experiments** — student/community pilots, lightweight marketing  
4. **Infrastructure & compliance** — hosting, privacy, accessibility, educational disclaimers  

**Not claimed:** Closed funding round, term sheet, investor commitments, investor meetings, or any investor engagement to date.

---

## 22. Evidence inventory (for auditors)

| Claim | Evidence |
|-------|----------|
| Production URL | **https://lex-learn-ten.vercel.app/** |
| Five live modules | `lib/course/modules.ts`, `docs/CONTENT_PLAN.md` |
| Quiz pass threshold 3/5 | Module quiz content in `lib/course/content/` |
| Metrics API integration | `app/api/metrics/events/route.ts`, `docs/WEEK5_METRICS_PLAN.md` |
| 25 / 25 users | Reference API verification (`npm run metrics:check`) |
| 22 survey responses | External product survey (count only; qualitative themes) |
| Survey feature themes | Qualitative synthesis from 22 responses |
| No investor engagement | Confirmed — none completed |
| No recovered lost feedback | Explicit exclusion per project record |

---

## 23. Deliberately omitted claims

The following were **not** included due to lack of verified evidence in the repository or project record:

- Market size / TAM / CAGR statistics  
- Revenue, MRR, ARR, or paying customer counts  
- Conversion rates, retention cohorts, or NPS  
- Named school/university partnerships or LOIs  
- Investor meetings, term sheets, or valuation  
- Quantitative results from native pilot feedback form  
- Recovery or storage of lost website feedback submissions  
- Ludwitt AI or JWT launch as shipped product features  

---

*LexLearn provides general educational information about UK law and is not legal advice.*
