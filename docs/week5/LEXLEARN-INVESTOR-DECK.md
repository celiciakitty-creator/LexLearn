# LexLearn — Investor Deck (Week 5)

**Format:** 12-slide Markdown deck  
**Stage:** Early-access pilot · Hult Summer Pilot 2026, Week 5  
**Audience:** Week 5 venture pass review  

---

## Slide 1 — LexLearn

**A simpler way to understand UK law and your everyday legal rights.**

- **Verified:** Production web app at **https://lex-learn-ten.vercel.app/** — beginner UK law (England & Wales)
- **Verified:** Five live modules · Civil · Criminal · Everyday Law
- **Tagline:** *Learn. Understand. Apply.*

**Assumption / hypothesis:** Young people and early-stage learners want law that feels clear—not intimidating.

---

## Slide 2 — Problem

Law shapes everyday decisions—contracts, disputes, consumer rights, criminal responsibility—yet most people lack a friendly on-ramp.

**Pain points (hypothesis aligned with product positioning):**

- Textbooks assume prior knowledge  
- Free content is fragmented and unreliable  
- Professional advice is costly for basic orientation  
- Legal language creates unnecessary fear  

**Verified:** LexLearn explicitly targets learners with **no prior legal knowledge required**.

---

## Slide 3 — Solution

**LexLearn** — structured, scenario-based UK law learning in plain language.

| Pillar | What we deliver |
|--------|-----------------|
| **Structured path** | 5 modules, sequential unlock |
| **Learn by doing** | Lessons + quizzes with instant feedback |
| **Real-world lens** | Case Spotlight, Statute Spotlight, Legal Bites |
| **Safe positioning** | Educational only — **not legal advice** |

**Verified:** Full lesson + quiz content live for all five modules.

---

## Slide 4 — Product

```
Homepage pilot  →  /learn/pilot  →  Module lesson  →  Quiz  →  Feedback
```

**Verified product surfaces:**

- Interactive lessons (objectives, scenarios, key terms, knowledge checks)
- 5-question module quizzes — pass at **3/5**
- Progress dashboard & learning levels (Legal Beginner → LexLearn Scholar)
- Achievements & Legal Bites carousel
- Case Spotlight (e.g. Donoghue v Stevenson, R v Williams)
- Statute Spotlight (e.g. Consumer Rights Act 2015)
- Light/dark theme · mobile-friendly pilot UI

**Stack:** Next.js 16 · TypeScript · Vercel deployment pattern

---

## Slide 5 — Who it's for

**Verified audience segments (homepage):**

| Segment | Need |
|---------|------|
| **Curious young people** | Everyday rights without legal background |
| **Prospective law students** | Plain-language preview before formal study |
| **Current students** | Bite-sized refresh across topics |
| **Everyday learners** | Practical rights in shopping, work, housing |

**Geography:** England & Wales (primary)

**Assumption / hypothesis:** Initial wedge = 16–24 UK learners considering law or civic rights literacy.

---

## Slide 6 — Early traction

### Verified — Week 5 gate passed ✅

| Metric | Count |
|--------|------:|
| **Unique users** | **25** |
| **Qualified external users** | **25** |

- Counted via self-hosted **Hult/Ludwitt reference metrics API** (Supabase-backed)
- Qualifying events: lesson started/completed, quiz submitted
- Re-verifiable: `npm run metrics:check`

### Verified — Product scope

- **Production URL:** **https://lex-learn-ten.vercel.app/**
- **5/5 modules live** with lessons & quizzes  
- **3 subject areas**  

### Verified — External product survey

- **22 responses** to an external product survey (qualitative themes only; demographic and methodology details not recorded here)

*No fabricated growth rates, revenue, or paying customers.*

---

## Slide 7 — What users are telling us

**Qualitative themes from the 22-response external product survey** (themes only):

1. 📷 **Pictures & graphics** — visual learning support  
2. 🧭 **Better navigation** — index, glossary, highlights for long lessons  
3. ⚖️ **Professional legal input** — features/content shaped by qualified reviewers  
4. 🎯 **More learning activities** — beyond read + single quiz  
5. 🤖 **Assistive Q&A** — help understanding while learning  
6. 👤 **Accounts & continuity** — return to previous training across devices  

**Native pilot feedback form:** live on homepage — **aggregate results not claimed here**.

**Not claimed:** Recovery of lost website feedback submissions.

**Product response (roadmap — future targets / hypotheses):** Visual assets → glossary/index → accounts → guarded assistive support.

---

## Slide 8 — Market & business opportunity

**Opportunity (assumption / hypothesis):**

Legal literacy for **non-lawyers** is underserved between social snippets and formal qualifications.

**Why now (assumption / hypothesis):**

- Digital-native learners expect interactive, mobile-first education  
- Civic and consumer rights awareness is increasingly relevant  
- AI raises expectations for guided, on-demand explanation — *not yet shipped by LexLearn*

**Deliberately omitted:** TAM/SAM/SOM numbers — no verified market study in repo.

**Competitive white space (qualitative — assumption / hypothesis):** UK-specific, beginner-focused, scenario-led, quiz-validated path with clear non-advice positioning.

---

## Slide 9 — Business model

**Today:** No monetisation — pilot / validation phase.

**Hypotheses under exploration (not validated):**

| Model | Notes |
|-------|-------|
| **B2C subscription** | Full library + premium features |
| **Freemium** | Free Module 1; paid expansion |
| **B2B / schools** | Institutional licences — *assumption; not verified or pursued* |
| **Platform ecosystem** | Ludwitt/Hult integration path — OAuth & metrics exist |

**Pricing hypothesis (unvalidated):** £5–£12/month student tier — *requires testing*.

---

## Slide 10 — Go-to-market

**Phase 1 — Now (verified)**

- Live product at **https://lex-learn-ten.vercel.app/** + pilot homepage journey  
- Cohort/community distribution (Hult Week 5)  
- Optional external survey + native feedback loop  
- Metrics-proven learning engagement (**25 qualified external users**)

**Phase 2 — Next (future targets)**

- Ship top survey requests (visuals, glossary, activities)  
- Accounts & cross-device progress  
- Legal review sign-off for scale  

**Phase 3 — Scale (assumption / hypothesis — not started)**

- Content marketing via Legal Bites / Case Spotlight  
- Explore institutional channels only after product-market signal — **not verified or pursued to date**

*Institutional outreach, partnerships, and paid acquisition are not claimed as completed.*

**Deliberately omitted:** CAC, conversion %, paid channel spend.

---

## Slide 11 — Roadmap

| Timeline | Milestone | Type |
|----------|-----------|------|
| **Q3 2026** | Legal review completion (Modules 2–5) | Future target |
| **Q3–Q4 2026** | Glossary / index / enhanced graphics | Future target |
| **Q4 2026** | User accounts + progress sync | Future target |
| **2027 H1** | Learning activities pack; professional content workflow | Assumption / hypothesis |
| **2027 H1** | Assistive Q&A pilot (with safeguards; Ludwitt AI proxy TBD) | Assumption / hypothesis |
| **2027+** | Module expansion | Future target |

**Verified gaps today:** No AI proxy · No JWT launch · Progress local-only · Legal review checklist open

---

## Slide 12 — The ask

### **To be confirmed.**

**Verified:** No investor engagement has been completed to date.

**Use of funds (concept — assumption / hypothesis; contingent on future funding decision):**

| Allocation | Purpose |
|------------|---------|
| **~40%** | Content, legal review, illustration |
| **~35%** | Product (accounts, navigation, activities, assistive features) |
| **~15%** | Pilot GTM & community learning |
| **~10%** | Infra, compliance, ops |

**Verified at this stage:**

- Working product at **https://lex-learn-ten.vercel.app/** with **25 qualified external users** (API-verified)  
- Clear survey-driven roadmap (qualitative themes from 22 responses)  
- Modular tech foundation & metrics instrumentation  
- Distinct positioning: approachable UK law, not legal advice  

**Not claimed:** Revenue, paying customers, partnerships, institutional outreach, investor conversations, or recovered historical feedback.

---

## Appendix — Verified facts quick reference

| Item | Detail |
|------|--------|
| Production URL | **https://lex-learn-ten.vercel.app/** |
| Modules | 5 live (Civil ×2, Criminal ×2, Everyday ×1) |
| Quiz pass | 3 of 5 correct |
| Metrics API | `lexlearn-week5-metrics-api.vercel.app` |
| App ID | `10af7f09-1664-4ccf-866c-c917dc9d9df2` |
| Unique users | 25 (reference API) |
| Qualified external users | 25 (reference API) |
| Survey responses | 22 (external product survey; themes only) |
| Investor engagement | None completed |
| Disclaimer | Educational information only |

---

*LexLearn provides general educational information about UK law and is not legal advice.*
