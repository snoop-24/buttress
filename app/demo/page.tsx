"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Nav";
import { LoopRing } from "@/components/LoopRing";
import { LOOP_NODES } from "@/components/loop";
import { DEMO_CANDIDATES, DEMO_FIRM, DEMO_PROJECT } from "@/data/seed";
import { SAMPLE_DOCS, DEFAULT_DOC } from "@/data/sample-docs";
import { computeDemandTimeline } from "@/agents/intake";
import { forecastGaps } from "@/agents/forecaster";
import { demandToProject, type ProcessedDoc } from "@/agents/paperwork";
import { computeFunnel } from "@/lib/funnel";
import { computeEfficiency, DEFAULT_BASELINE, BASELINE_ASSUMPTIONS } from "@/lib/metrics";
import type { LaborGap } from "@/agents/types";
import type { CampaignCreative } from "@/agents/campaign";
import type { EfficiencyReport } from "@/lib/metrics";
import type { FunnelStage, Project } from "@/lib/domain";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const FUNNEL_LABELS: { stage: FunnelStage; label: string }[] = [
  { stage: "lead", label: "Leads" },
  { stage: "applied", label: "Applied" },
  { stage: "screened", label: "Screened" },
  { stage: "enrolled", label: "Enrolled" },
  { stage: "credentialed", label: "Credentialed" },
  { stage: "dispatched", label: "Dispatched" },
];

type Phase = "idle" | "running" | "done";

export default function Demo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [demoMode, setDemoMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState("Ready");
  const [gap, setGap] = useState<LaborGap | null>(null);
  const [creative, setCreative] = useState<CampaignCreative | null>(null);
  const [typed, setTyped] = useState("");
  const [funnelCounts, setFunnelCounts] = useState<Partial<Record<FunnelStage, number>>>({});
  const [efficiency, setEfficiency] = useState<EfficiencyReport | null>(null);
  const [docText, setDocText] = useState(DEFAULT_DOC);
  const [processed, setProcessed] = useState<ProcessedDoc | null>(null);
  const runId = useRef(0);

  const regionLabel = `${DEMO_FIRM.region.city}, ${DEMO_FIRM.region.state}`;

  const run = useCallback(async () => {
    const id = ++runId.current;
    const alive = () => runId.current === id;
    // reset
    setPhase("running");
    setActiveIndex(undefined);
    setGap(null);
    setCreative(null);
    setTyped("");
    setFunnelCounts({});
    setEfficiency(null);
    setProcessed(null);

    // 1. Intake — process the source paperwork live (Groq unless offline)
    setStatus(demoMode ? "Reading paperwork (offline)…" : "Reading the project paperwork live…");
    setActiveIndex(0);
    let project: Project = DEMO_PROJECT;
    try {
      const res = await fetch("/api/paperwork", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ document: docText, demoMode }),
      });
      const doc: ProcessedDoc = await res.json();
      if (alive()) setProcessed(doc);
      if (doc.demand && doc.demand.phases.some((p) => Object.keys(p.crew).length)) {
        project = demandToProject(doc.demand, DEMO_FIRM.id, DEMO_FIRM.region);
      }
    } catch {
      /* the API falls back internally; keep DEMO_PROJECT */
    }
    if (!alive()) return;
    const timeline = computeDemandTimeline(project);
    await sleep(700);
    if (!alive()) return;

    // 2. Forecaster
    setStatus("Forecasting the labor gap…");
    setActiveIndex(1);
    const gaps = forecastGaps({ timeline, firm: DEMO_FIRM, projectStartDate: project.startDate });
    const topGap = gaps[0];
    await sleep(700);
    setGap(topGap);
    await sleep(900);
    if (!alive()) return;

    // 3. Campaign (live Groq unless demoMode)
    setStatus(demoMode ? "Generating campaign (offline)…" : "Generating campaign live on Groq…");
    setActiveIndex(2);
    const priorFields = [...new Set(DEMO_CANDIDATES.map((c) => c.priorField))].slice(0, 4);
    let creativeResult: CampaignCreative;
    try {
      const res = await fetch("/api/campaign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          trade: topGap.trade,
          regionLabel,
          gapCount: topGap.gap,
          neededByDate: topGap.neededByDate,
          firmName: DEMO_FIRM.name,
          priorFields,
          demoMode,
        }),
      });
      creativeResult = await res.json();
    } catch {
      // Network dead — the API itself falls back, but guard the client too.
      const { PREBAKED_CAMPAIGN } = await import("@/agents/campaign");
      creativeResult = PREBAKED_CAMPAIGN;
    }
    if (!alive()) return;
    setCreative(creativeResult);
    // Typewriter reveal of the landing headline + ad body. Bounded to a fixed
    // number of steps (not per-character) so it stays snappy and can't drag if
    // timers get throttled (e.g. the tab loses focus mid-demo).
    const body =
      creativeResult.adBody.length > 180
        ? `${creativeResult.adBody.slice(0, 179)}…`
        : creativeResult.adBody;
    const script = `${creativeResult.landing.headline}\n\n${body}`;
    const typeSteps = 26;
    for (let k = 1; k <= typeSteps; k++) {
      if (!alive()) return;
      setTyped(script.slice(0, Math.round((script.length * k) / typeSteps)));
      await sleep(26);
    }
    setTyped(script);
    await sleep(500);

    // 4. Nurture
    setStatus("Nurturing candidates into the funnel…");
    setActiveIndex(3);
    await sleep(900);
    if (!alive()) return;

    // 5. Screening
    setStatus("Screening & credentialing (simulated inflow)…");
    setActiveIndex(4);
    await sleep(900);
    if (!alive()) return;

    // 6. Dispatch + funnel fill
    setStatus("Dispatching credentialed workers to the job…");
    setActiveIndex(5);
    const funnel = computeFunnel(DEMO_CANDIDATES.length, topGap.gap);
    // Count the funnel up over a fixed number of frames (bounded), with a
    // per-stage stagger so it reads as a left-to-right cascade.
    const funnelSteps = 22;
    for (let k = 1; k <= funnelSteps; k++) {
      if (!alive()) return;
      const t = k / funnelSteps;
      const next: Partial<Record<FunnelStage, number>> = {};
      FUNNEL_LABELS.forEach(({ stage }, i) => {
        const st = Math.min(1, Math.max(0, (t - i * 0.05) / 0.75));
        next[stage] = Math.round(funnel.counts[stage] * st);
      });
      setFunnelCounts(next);
      await sleep(40);
    }
    setFunnelCounts(funnel.counts);
    await sleep(500);
    if (!alive()) return;

    // Metric
    setStatus("Loop closed.");
    const eff = computeEfficiency({ recruiters: 0, days: 6, pipeline: funnel.pipeline });
    setEfficiency(eff);
    setActiveIndex(undefined);
    setPhase("done");
  }, [demoMode, regionLabel]);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-[15px] font-semibold tracking-tight">Buttress</span>
            <span className="ml-2 font-mono text-[12px] text-fg-dim">/ live run</span>
          </Link>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 font-mono text-[12px] text-fg-muted">
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="accent-accent"
              />
              offline mode
            </label>
            <span className="hidden font-mono text-[12px] text-fg-dim sm:block">{status}</span>
            <button
              onClick={run}
              disabled={phase === "running"}
              className="btn-primary px-5 py-1.5 text-[14px] disabled:opacity-50"
            >
              {phase === "running" ? "Running…" : phase === "done" ? "Run again" : "Run the factory"}
            </button>
          </div>
        </div>
        {/* Timeline strip */}
        <div className="mx-auto flex max-w-7xl gap-1 px-6 pb-2">
          {LOOP_NODES.map((n, i) => {
            const state =
              activeIndex === undefined
                ? phase === "done"
                  ? "done"
                  : "idle"
                : i < activeIndex
                  ? "done"
                  : i === activeIndex
                    ? "active"
                    : "idle";
            return (
              <div
                key={n.id}
                className="h-1 flex-1 rounded-full transition-colors duration-300"
                style={{
                  background:
                    state === "active" ? "var(--accent)" : state === "done" ? "var(--good)" : "var(--border-strong)",
                }}
              />
            );
          })}
        </div>
      </header>

      {/* Source paperwork */}
      <div className="mx-auto w-full max-w-7xl px-6 pt-6">
        <div className="rounded-2xl border border-border bg-bg-card p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="eyebrow">Source paperwork · back office {demoMode ? "(offline)" : "· live"}</span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_DOCS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setDocText(d.text);
                    setProcessed(null);
                  }}
                  disabled={phase === "running"}
                  className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10.5px] text-fg-muted transition-colors hover:bg-bg-elevated disabled:opacity-40"
                >
                  {d.kind}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <textarea
              value={docText}
              onChange={(e) => {
                setDocText(e.target.value);
                setProcessed(null);
              }}
              disabled={phase === "running"}
              spellCheck={false}
              className="h-28 w-full resize-none rounded-lg border border-border bg-bg px-3 py-2 font-mono text-[11px] leading-relaxed text-fg-muted outline-none focus:border-border-strong disabled:opacity-70"
            />
            <div className="rounded-lg border border-border bg-bg-elevated/40 p-3">
              {processed ? (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded border border-border-strong px-1.5 py-0.5 font-mono text-[9.5px] uppercase text-fg-muted">
                      {processed.docType}
                    </span>
                    <span className="font-mono text-[10.5px] text-good">{processed.autoAction}</span>
                  </div>
                  <p className="text-[12.5px] font-medium text-fg">{processed.title}</p>
                  <p className="mt-0.5 text-[11.5px] text-fg-muted">{processed.summary}</p>
                </div>
              ) : (
                <p className="font-mono text-[11px] text-fg-dim">
                  Press Run — Buttress parses this document live and derives the labor demand.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stage */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-6 pt-6 pb-8 lg:grid-cols-[1.05fr_1fr]">
        {/* Left: the loop */}
        <section className="flex flex-col items-center justify-center rounded-2xl border border-border bg-bg-card p-6">
          <LoopRing activeIndex={activeIndex} size={480} />
          {gap && (
            <div className="mt-4 rounded-lg border border-accent/30 bg-accent/5 px-4 py-2 font-mono text-[13px] text-accent-soft">
              gap: {gap.gap} {gap.trade}s · {regionLabel} · by {gap.neededByDate}
            </div>
          )}
        </section>

        {/* Right: creative + funnel + metric */}
        <section className="flex flex-col gap-6">
          {/* Creative panel */}
          <div className="min-h-[220px] rounded-2xl border border-border bg-bg-card p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="eyebrow">Campaign · {demoMode ? "offline" : "live on Groq"}</span>
              {creative && <span className="font-mono text-[11px] text-good">● generated</span>}
            </div>
            {typed ? (
              <div>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-fg">{typed}<span className="animate-pulse">▍</span></p>
                {creative && phase === "done" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="btn-primary px-3 py-1 text-[12px]">{creative.landing.cta}</span>
                    {creative.social.map((s) => (
                      <span key={s.platform} className="pill px-3 py-1 font-mono text-[11px] text-fg-muted">{s.platform}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="font-mono text-[13px] text-fg-dim">Awaiting the gap signal…</p>
            )}
          </div>

          {/* Funnel */}
          <div className="rounded-2xl border border-border bg-bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="eyebrow">Recruitment funnel</span>
              <span className="font-mono text-[11px] text-fg-dim">simulated inflow</span>
            </div>
            <div className="space-y-2">
              {FUNNEL_LABELS.map(({ stage, label }, i) => {
                const max = DEMO_CANDIDATES.length;
                const val = funnelCounts[stage] ?? 0;
                return (
                  <div key={stage} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 font-mono text-[11px] text-fg-dim">{label}</span>
                    <div className="h-5 flex-1 overflow-hidden rounded bg-bg-elevated">
                      <div
                        className="h-full rounded transition-[width] duration-150"
                        style={{
                          width: `${(val / max) * 100}%`,
                          background: i === FUNNEL_LABELS.length - 1 ? "var(--good)" : "linear-gradient(90deg, var(--accent), var(--accent-soft))",
                        }}
                      />
                    </div>
                    <span className="w-7 text-right font-mono text-[13px] text-fg">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metric */}
          <div
            className={`rounded-2xl border p-6 transition-all duration-500 ${efficiency ? "border-accent/40 bg-accent/[0.04]" : "border-border bg-bg-card opacity-60"}`}
          >
            <span className="eyebrow">Deterministic efficiency · computed in code</span>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[11px] text-fg-dim">MANUAL BASELINE</p>
                <p className="mt-1 text-[15px] text-fg-muted">
                  {DEFAULT_BASELINE.recruiters} recruiters · {DEFAULT_BASELINE.days / 7} wks · {DEFAULT_BASELINE.hires} hires
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] text-accent-soft">BUTTRESS</p>
                <p className="mt-1 text-[15px] text-fg">
                  0 recruiters · 6 days · {efficiency ? efficiency.measured.pipeline : "—"} in pipeline
                </p>
              </div>
            </div>
            {efficiency && (
              <>
                <div className="mt-5 flex gap-6">
                  <Multiple value={efficiency.speedMultiple} label="faster" />
                  <Multiple value={efficiency.volumeMultiple} label="pipeline" />
                  <Multiple value={efficiency.throughputMultiple} label="throughput" />
                </div>
                <ul className="mt-5 space-y-1 border-t border-border pt-4">
                  {BASELINE_ASSUMPTIONS.map((a) => (
                    <li key={a} className="font-mono text-[10.5px] leading-relaxed text-fg-dim">— {a}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Multiple({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <span className="display text-4xl font-semibold text-accent">{value}×</span>
      <span className="ml-1 text-[13px] text-fg-muted">{label}</span>
    </div>
  );
}
