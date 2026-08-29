# Buttress — 3-Minute Live Demo Script

**Format:** live only — the landing page + the deployed site. **No slides.**
**Distribution:** Talk 1:30 · Demo 1:00 · Close 0:30. Strict 3:00.
**Audience:** builders, ranked-choice vote. Win = clarity + one line they repeat + a woah moment. Don't rush — a rushed demo reads as "I don't understand my own product." You have time. Use the pauses.

**Setup before you walk up:** browser FOCUSED, full-screen. Two tabs: `/` (landing, top) and the deployed `/demo` (idle). Timers throttle when unfocused — never tab away mid-run.

*Bold = a line to land. Pause after it. **Italics = stage direction.***

---

## PART 1 — Landing page · 0:00 → 1:30

*Open on `/`. Don't touch anything. Let the hero sit for the first line.*

> "Right now, construction firms are turning down real projects. Not because there's no money, and not because there's no demand — **because they physically cannot find the people to build them.**
>
> The trades are short hundreds of thousands of workers. And every tool built for this problem does the same thing: it fights over the workers who already exist. Recruiters, staffing agencies, forecasting software — all of them reshuffling the same shrinking deck."

*Pause. This is the turn.*

> "Buttress does something nobody else does. **It reads the answer straight out of the firm's own paperwork.**"

*Scroll slowly to `#backoffice` — land on the PaperworkProcessor.*

> "A mid-size contractor runs hundreds of live document streams — RFIs, change orders, schedules, pay applications. A back office full of people reading PDFs all day. And buried in those PDFs is a fact nobody connects to hiring: **exactly which trade you're about to be short. In which city. In which week.**
>
> Buttress automates that entire back office. It ingests the paperwork the way that team does — but it doesn't just file it. It turns it into the thing you actually need: **the hiring campaign that fills the gap.**"

*Scroll to `#loop`. Stop on the ring.*

> "Six agents, end to end, no human hand-off between them. Read the paperwork. Forecast the shortage. Write the campaign. Work the funnel. Credential. Dispatch onto the exact job that created the demand.
>
> And it's a loop — every worker it lands lets the firm take on more work, which creates more demand, which feeds the next turn. **It doesn't run once. It compounds.**
>
> That's the pitch. Now let me just show you it's real."

*Switch tab to the deployed `/demo`. Target: 1:30.*

---

## PART 2 — Demo · 1:30 → 2:30

*Click **Run** immediately. Talk over it — never narrate silence.*

> "This is a real firm's project pipeline. Up top — **that's a live AI call, right now, reading an actual construction schedule.** Not a recording. Not a fixture. The model, reading the document, live."

*Gap resolves. Point at it. Slow down.*

> "And there it is: **twelve electricians short. Phoenix. Needed by October 26th.**
>
> One line about that number: it's computed in code, not guessed by a model — so a contractor can actually trust it. That's the only sentence I'll spend on it."

*Campaign generation starts writing on screen.*

> "Because *this* is the part that doesn't exist anywhere else — **watch the campaign write itself.** Targeting, channel, the actual ad copy, pointed at that exact trade, that exact city, that exact deadline. **A PDF just became a hiring campaign, and no human touched it.**"

*Funnel animates 30 → 24 → 20 → 16 → 12.*

> "Candidates come in — labeled **simulated**, we're not faking placements — get screened, credentialed, dispatched onto the job that started all of this. **The loop closes on screen.**"

*Target: 2:30. If the metric/own-the-code beats fit, add: "measured against the manual baseline — and every agent you just saw ships as real code you own, built in Qoder." Cut it without hesitation if you're at 2:30.*

---

## PART 3 — Close · 2:30 → 3:00

*Stop clicking. Look up at the room. This is the vote. Slow. Down.*

> "Every other tool automates one corner of the office and stops.
>
> **Buttress automates the whole thing — all the way to the hire.**
>
> And here's why that matters right now: AI is emptying the cubicles at the exact moment the trades are starving for people. **The same automation wave that's laying people off, we point straight at the jobs it can never touch.**
>
> The construction back office stops being a filing cabinet — and starts **running itself, all the way to the crew on site.**
>
> That's Buttress. Thank you."

---

## The four lines that carry the vote (memorize verbatim)

1. **"It reads the answer straight out of the firm's own paperwork."** — the turn, ~0:30
2. **"A PDF just became a hiring campaign, and no human touched it."** — the woah, ~2:10
3. **"Buttress automates the whole office — all the way to the hire."** — the reframe, ~2:35
4. **"The same automation wave that's laying people off, we point at the jobs it can never touch."** — the line they repeat, ~2:45

If nerves hit and you blank, these four in order ARE the pitch.

---

## Guardrails

- Say **"hundreds of thousands"** — never "500k." (Modeled additional-worker need, not vacancies.)
- Candidate inflow is **simulated** — say it out loud. Never imply real placements.
- Don't claim "the only one converting career-switchers" — SkillCat/Interplay do too. Your claim is the **paperwork→campaign linkage.**
- No BlackRock grant, no DOL apprentice number on stage.
- **Stall plan:** if the live run hangs, hit the offline toggle, say *"pre-baked fallback — same numbers either way,"* keep talking. Never debug on stage.
- **Pacing rule:** if you feel yourself speeding up, you're losing them. The four lines above only work with a pause after each. Silence is a tool — the other teams won't use it.
