# Foundry — Project Handoff Brief

> **Purpose of this file:** self-contained handoff so a fresh session (e.g. Antigravity IDE) can continue engineering with zero prior context. It captures the event, the research, every locked decision and *why*, the product concept, architecture, and build sequence. Read top to bottom.

---

## 1. The event

- **Hackathon:** Qoder × Beta Fund · Agent Factory — Sunnyvale, CA
- **Date:** Saturday, **August 29, 2026** (brief written Aug 23)
- **Format:** 1–2 builders (we are **solo**). Working demo required — **not slides**. **Mandatory Qoder integration.**
- **Build window:** ~11:15am–5:00pm minus lunch ≈ **~4.5 hrs** live. Demo showcase 5:00pm, awards 6:30pm.
- **Judged by a PANEL** (not audience vote): Shuhao Zhang (co-founder, Tiny Fish), Chenyi Zhang (Technical Staff, Character.AI), a Qoder rep, an active agent-stack VC.
- **Prizes:** $500 / $300 / $200. Standout teams → **Beta Fund Fellowship** pipeline ($200K pre-seed). *This Fellowship intro is the real prize.*
- **Four tracks:** Builder Agents · Multi-Agent Orchestration · Agent Runtime & Infra · **Vertical Agent Factories** ← *our track: "Domain-specific factories that produce agents for one industry at a time."*
- **Builder constraints:** competing for a prize; **pre-building is allowed** (builder sets the rules); can scaffold freely before the event. Builder has ~30 min/day this week but relies on agent-assisted build for the heavy lifting.

**What a panel of agent-infra experts rewards, in order:** (1) is it *actually a factory that produces agents*, not one hardcoded agent with a skin? (2) technical depth they can interrogate live; (3) "why is this a company?"; (4) a provable, on-screen result rather than a claimed one.

---

## 2. Strategic frame & research (why this concept, not another)

**Prior builder win-pattern (project "Deja"):** deterministic, provable-on-screen truth — *the model never produces the headline number; deterministic code does, with assumptions shown.* Keep this DNA; it plays even better to infra judges than to a crowd.

**Competitive research — the lanes already owned (do NOT compete head-on):**
- **Back office** → **Trunk Tools + Cortex**: agents for RFIs, submittals, change orders, bid analysis. Hard numbers (submittal cycle time −74%, stuck submittals 42%→2%). Panel may know them.
- **Worker matching** → **Skillit**: AI hiring, 190k+ vetted craft workers, backed by DPR Construction & Suffolk Technologies.
- **Forecasting** → **Bridgit / Buildr / Designflow**: project pipeline → labor forecast.
- Crowded/dead lanes generally: customer support, legal (Harvey ~$11B), coding, sales/SDR, scheduling, patient-facing healthcare. 3,800+ agent startups shut in 2025, 1,800+ in early 2026 — mostly here.

**The gap they all share:** every one operates *downstream of a worker who already exists*. They fight over the same shrinking pool. Meanwhile: ~500k empty US trade jobs, retirements outpacing entries, and AI hollowing out white-collar work — producing exactly the career-switchers the trades need. **Nobody builds the agent system that manufactures net-new workforce supply.** That is the whitespace.

**Macro tailwind:** DOL + BlackRock ($100M Future Builders) + federal apprenticeship push all aim at *growing the pipeline* — validating that the bottleneck is supply, not matching.

---

## 3. The concept — Foundry

**Name:** Foundry (a factory that casts the agents *and* forges the workforce). Placeholder — change freely.

**One-line thesis:**
> Foundry is the operating system that makes a construction company autonomous end to end. Its wedge is a **workforce supply factory**: it reads the firm's project pipeline to predict which trades will be short (where/when), then runs autonomous recruitment *marketing* that converts career-switchers **into** those trades, nurtures them to credentialed, and dispatches them onto the exact jobs that created the demand.

**Why the COMPLETE loop is the moat (it compounds):**
> back office reveals labor demand → supply factory fills it → new workers let the firm take on more projects → more back-office work + more demand → repeat. Each turn makes the next bigger. A point solution cannot do this. This is the "why a company" answer.

**Why it wins THIS panel:**
- A **factory in two senses** — builds software agents *and* forges human workers into the labor force (perfect for an "Agent Factory" theme).
- Rides 2026's biggest story: *"AI creates the career-switchers we route into the shortage AI can't fill."*
- Fully demo-able with **no job site** — all comms, data, funnels.
- Owns the *whole* loop, staying out of Trunk's and Skillit's owned lanes.

---

## 4. The closed-loop fleet

| Node | Agent(s) | Role | Build depth |
|---|---|---|---|
| Back office (demand engine) | **Intake/Bid Agent** | Ingest a project → schedule + trade breakdown; produces the labor-demand signal | *Believable-shallow — do NOT out-build Trunk* |
| Gap detection | **Labor Gap Forecaster** | Time-phase schedule vs. roster/local supply → "12 electricians, Phoenix, 6 weeks" | Real but simple; **deterministic** |
| **Supply factory (WEDGE)** | **Campaign Agent** | Generate targeted recruitment creative (ad copy, landing page, social) for career-switchers in that trade/region | **Deepest — real LLM output** |
| | **Nurture Agent** | Run the funnel: interest → application → apprenticeship enrollment | Deep |
| | **Screening/Credentialing Agent** | Qualify candidates, map to a cert/apprenticeship path, track onboarding | Deep |
| Dispatch | **Dispatch Agent** | Place credentialed workers onto the jobs that generated the demand → loop closes | Medium |
| Control plane | **The Foundry factory** | Generates/configures/deploys the fleet for a firm; dashboard visualizes loop + live metric | Core |

**Deterministic proof (Deja DNA):** on-screen number = **code-computed efficiency multiple**, never model-claimed. Manual baseline (hardcoded, cited assumptions: recruiter throughput, industry time-to-hire) vs. measured Foundry run (campaigns generated, elapsed time, pipeline count). Assumptions shown on screen. **Anything simulated (e.g. inbound candidate flow) is labeled simulated.**

**Qoder integration (mandatory):**
1. Build Foundry itself in Qoder.
2. **Differentiator feature:** the generated fleet is emitted as *real, editable agent code the firm owns*; live, open that codebase in Qoder — "every other agent builder hands you a flowchart you can't leave; Foundry hands you a codebase." Anti-black-box.

---

## 5. Hero demo — "the loop closing" (the ONE live moment)

Everything else is pre-built and shown as supporting; **this single run is performed live (~90s):**
1. A project lands for the demo firm (mid-size GC, Phoenix).
2. Intake agent ingests it → Gap Forecaster flags **"you'll be 12 electricians short in Phoenix in 6 weeks."**
3. Supply-factory agents fire: Campaign Agent auto-generates recruitment creative + landing page **on screen**; Nurture + Screening move candidates through the funnel.
4. Pipeline fills; Dispatch assigns them to the job that created the gap.
5. **Deterministic efficiency multiple lands** ("manual: 3 recruiters / 6 wks / 4 hires — Foundry: 0 recruiters / 6 days / 12 in pipeline").

**Fallback:** pre-recorded run of the same loop (repeat Deja's recorded-fallback discipline).

---

## 6. Scope discipline

- **Deepest:** supply-factory agents (real LLM-generated campaigns/creative/landing pages) + deterministic metric + loop-close visualization. This is what's novel and what the demo performs.
- **Believable-shallow:** back-office intake (one agent, enough to emit the demand signal), forecasting math (real but simple), credentialing (path-mapping, not a real LMS).
- **Data:** realistic seeded/synthetic — one demo firm, one project whose schedule implies the labor curve, a small simulated pool of career-switcher candidates. Campaign *outputs* are genuinely LLM-generated; inbound candidate flow is simulated and labeled.
- **Pre-build everything, rehearse.** Live on stage = trigger the one end-to-end loop run.

---

## 7. Architecture & stack

Reuse the proven Deja stack: **Next.js (App Router) on Vercel**, TypeScript throughout, a fast OpenAI-protocol LLM (Groq or equivalent) behind the agent loop. Deterministic metric logic in plain TS (never model-produced). Minimal persistence (in-memory or SQLite/Convex — lightest that survives a live demo). Agent orchestration = a small TS layer; each agent is a typed function with tools + a system prompt; the factory configures/instantiates them per firm.

**Component boundaries (each independently understandable/testable):**
- `agents/` — one file per agent (intake, forecaster, campaign, nurture, screening, dispatch); clear input→output contract each.
- `factory/` — generates/configures the fleet for a firm; emits the "owned code" bundle for the Qoder demo.
- `lib/metrics.ts` — deterministic baseline-vs-measured comparison (Deja pattern); unit-tested for determinism.
- `data/` — seeded demo firm, project, schedule, candidate pool.
- `app/` — dashboard: loop visualization, live-run trigger, metric readout, generated-creative preview.

---

## 8. Build sequence (Aug 23 → Aug 29)

1. **Day 1–2:** scaffold Next.js app in this dir; data model + seeded demo firm/project/candidates; dashboard shell.
2. **Day 2–3:** intake agent + deterministic Labor Gap Forecaster (the demand signal).
3. **Day 3–5:** supply-factory agents — Campaign (real creative/landing-page generation), Nurture, Screening. The deep part.
4. **Day 5–6:** Dispatch + loop-close visualization + `lib/metrics.ts` efficiency multiple + Qoder code-emit feature.
5. **Day 6:** end-to-end wiring, the single live-run trigger, UI/UX polish.
6. **Fri Aug 28 / Sat AM:** rehearse the 90s run, record the fallback, tighten pitch + Q&A.

---

## 9. Judging Q&A prep

- *"How is this different from Skillit / Trunk?"* → They operate on workers who already exist; Foundry **manufactures net-new supply** and owns the full **compounding** loop.
- *"Is the inbound real?"* → Campaign generation is real LLM output; candidate inflow is simulated and labeled — with metric assumptions on screen.
- *"Why a company / unit economics?"* → the loop compounds (§3).
- *"Penetration of AI in construction?"* → frame as "least-digitized major industry on earth"; do **not** quote an unverified penetration %.

---

## 10. Verification (definition of done for the demo)

- **End-to-end:** trigger the live run in the deployed app; project → gap → generated campaign → filled pipeline → dispatch → metric renders in <~90s with no manual intervention.
- **Determinism:** `lib/metrics.ts` returns the same multiple for the same inputs across runs (unit test); numbers trace to code, not the model.
- **Qoder:** emitted fleet codebase opens and is legible in Qoder.
- **Fallback:** recorded run plays cleanly offline.
- **Rehearsal:** full 90s run performed start-to-finish ≥2× before Saturday.

---

## 11. Decisions locked (with rationale) & open questions

**Locked:**
- Vertical = **construction** (whitespace ∩ agent-shaped back-office ∩ demo-able ∩ VC-legible TAM).
- Headline = **workforce supply factory** (manufacture net-new trades workers) — the one lane nobody owns.
- Build the **complete compounding loop** (back office + demand signal + supply generation + dispatch) — integration/"everything in one place" is the moat, and it compounds.
- Hero demo = **the loop closing, live**.
- Keep **Deja's deterministic-proof** discipline; label all simulated data.
- Solo build; pre-build freely; Next.js/TS/Vercel stack.

**Open (decide at build time):**
- Confirm the mandatory-Qoder requirement is satisfied by "built in Qoder + fleet-as-owned-code," or whether judges expect something more specific.
- Persistence choice (in-memory vs. Convex/SQLite) — pick lightest that survives a live demo.
- How real to make candidate inflow (pure simulation vs. a tiny genuine funnel) — default to labeled simulation.

---

## 12. Session note for the next agent

This brief was produced through a full brainstorming pass (event analysis → whitespace research → competitive teardown → concept → scope). The concept is **approved in direction** by the builder; it has **not** been approved as a finalized implementation plan or started in code. Next step in a new session: confirm the open questions in §11, then scaffold per §7–8. Nothing has been built yet — the project directory is empty apart from this file.
