"use client";

import { useEffect, useState } from "react";
import { SAMPLE_DOCS, SAMPLE_EXTRACTIONS } from "@/data/sample-docs";
import { demandToProject, type ProcessedDoc } from "@/agents/paperwork";
import { computeDemandTimeline } from "@/agents/intake";
import { forecastGaps } from "@/agents/forecaster";
import { DEMO_FIRM } from "@/data/seed";
import { TRADE_LABELS } from "@/lib/domain";
import type { LaborGap } from "@/agents/types";

const SCAN_MS = 1200; // scan-line sweep
const HOLD_MS = 3200; // linger on the parsed result before the next document

/**
 * Interactive back-office automation: pick or paste a real construction
 * document, and Buttress classifies + extracts it live (Groq via /api/paperwork).
 * For a schedule it derives the labor gap deterministically on top of the
 * extraction. Used on the landing (#backoffice) and the demo page.
 */
export function PaperworkProcessor() {
  // In presentation mode (?present) the section plays itself — cycle the
  // documents through an extraction animation instead of waiting for a click.
  const [auto, setAuto] = useState(false);
  useEffect(() => {
    try {
      setAuto(new URLSearchParams(window.location.search).has("present"));
    } catch {
      /* SSR / no window */
    }
  }, []);

  const [docId, setDocId] = useState(SAMPLE_DOCS[0].id);
  const [text, setText] = useState(SAMPLE_DOCS[0].text);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ProcessedDoc | null>(null);
  const [gap, setGap] = useState<LaborGap | null>(null);

  const pick = (id: string) => {
    const d = SAMPLE_DOCS.find((s) => s.id === id);
    if (!d) return;
    setDocId(id);
    setText(d.text);
    setResult(null);
    setGap(null);
  };

  async function process() {
    setBusy(true);
    setResult(null);
    setGap(null);
    try {
      const res = await fetch("/api/paperwork", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ document: text }),
      });
      const doc: ProcessedDoc = await res.json();
      setResult(doc);
      if (doc.demand && doc.demand.phases.some((p) => Object.keys(p.crew).length)) {
        const project = demandToProject(doc.demand, DEMO_FIRM.id, DEMO_FIRM.region);
        const timeline = computeDemandTimeline(project);
        const gaps = forecastGaps({ timeline, firm: DEMO_FIRM, projectStartDate: project.startDate });
        setGap(gaps[0] ?? null);
      }
    } catch {
      /* the API falls back internally; nothing to do */
    } finally {
      setBusy(false);
    }
  }

  if (auto) return <AutoPaperwork />;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* Input */}
      <div className="rounded-2xl border border-border bg-bg-card p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {SAMPLE_DOCS.map((d) => (
            <button
              key={d.id}
              onClick={() => pick(d.id)}
              className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
                docId === d.id ? "bg-accent/15 text-accent-soft" : "border border-border text-fg-muted hover:bg-bg-elevated"
              }`}
            >
              {d.kind}
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);
            setGap(null);
          }}
          spellCheck={false}
          className="h-56 w-full resize-none rounded-lg border border-border bg-bg px-3 py-2 font-mono text-[11.5px] leading-relaxed text-fg-muted outline-none focus:border-border-strong"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[11px] text-fg-dim">paste your own document, or pick one above</span>
          <button onClick={process} disabled={busy} className="btn-primary px-4 py-1.5 text-[13px] disabled:opacity-50">
            {busy ? "Processing…" : "Process paperwork"}
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="rounded-2xl border border-border bg-bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="eyebrow">Extraction</span>
          {result && <span className="font-mono text-[11px] text-good">● processed</span>}
        </div>
        {!result ? (
          <p className="font-mono text-[13px] text-fg-dim">Process a document to see it parsed…</p>
        ) : (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-md border border-border-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-fg-muted">
                {result.docType}
              </span>
              <span className="font-mono text-[11px] text-good">{result.autoAction}</span>
            </div>
            <p className="text-[14px] font-medium text-fg">{result.title}</p>
            <p className="mt-1 text-[13px] text-fg-muted">{result.summary}</p>
            <dl className="mt-4 space-y-1.5">
              {result.fields.map((f, i) => (
                <div key={i} className="flex justify-between gap-4 border-b border-border/60 pb-1.5 text-[12.5px]">
                  <dt className="font-mono text-fg-dim">{f.label}</dt>
                  <dd className="text-right text-fg-muted">{f.value}</dd>
                </div>
              ))}
            </dl>
            {gap && (
              <div className="mt-4 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2.5 font-mono text-[12px] text-accent-soft">
                → derived demand: {gap.gap} {TRADE_LABELS[gap.trade].toLowerCase()}s short · {DEMO_FIRM.region.city} · by {gap.neededByDate}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Self-playing back-office animation for presentation mode: cycles through the
 * sample documents, sweeps a scan line over each, then reveals its pre-baked
 * extraction and the labor-demand signal it contributes. Deterministic and
 * offline — no API calls — and compact enough to sit in one presentation slide.
 */
function AutoPaperwork() {
  const [idx, setIdx] = useState(0);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    let alive = true;
    let toReveal: ReturnType<typeof setTimeout>;
    let toNext: ReturnType<typeof setTimeout>;
    const run = (i: number) => {
      if (!alive) return;
      setIdx(i);
      setScanning(true);
      toReveal = setTimeout(() => {
        if (!alive) return;
        setScanning(false);
        toNext = setTimeout(() => run((i + 1) % SAMPLE_DOCS.length), HOLD_MS);
      }, SCAN_MS);
    };
    run(0);
    return () => {
      alive = false;
      clearTimeout(toReveal);
      clearTimeout(toNext);
    };
  }, []);

  const doc = SAMPLE_DOCS[idx];
  const ex = SAMPLE_EXTRACTIONS[doc.id];

  return (
    <div className="space-y-4">
      {/* Passive tabs — show which document type is being processed right now. */}
      <div className="flex flex-wrap gap-1.5">
        {SAMPLE_DOCS.map((d, i) => (
          <span
            key={d.id}
            className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
              i === idx ? "bg-accent/15 text-accent-soft" : "border border-border text-fg-dim"
            }`}
          >
            {d.kind}
          </span>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* The document, with a scan line sweeping over it */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="eyebrow">{doc.kind}</span>
            <span className={`font-mono text-[10px] ${scanning ? "text-accent-soft" : "text-good"}`}>
              {scanning ? "● scanning" : "● parsed"}
            </span>
          </div>
          <pre className="max-h-36 overflow-hidden whitespace-pre-wrap font-mono text-[10.5px] leading-relaxed text-fg-muted">
            {doc.text}
          </pre>
          {scanning && <span key={`scan-${idx}`} className="scan-line" />}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg-card to-transparent" />
        </div>

        {/* The extraction it produced */}
        <div className="rounded-2xl border border-border bg-bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="eyebrow">Extraction</span>
            {!scanning && <span className="font-mono text-[10px] text-good">● {ex.autoAction}</span>}
          </div>
          {scanning ? (
            <div className="space-y-1.5 pt-1 font-mono text-[11.5px] text-fg-dim">
              <p className="animate-pulse">classifying document…</p>
              <p className="animate-pulse [animation-delay:0.2s]">extracting key fields…</p>
              <p className="animate-pulse [animation-delay:0.4s]">deriving labor demand…</p>
            </div>
          ) : (
            <div className="fade-up">
              <p className="text-[13.5px] font-medium text-fg">{ex.title}</p>
              <p className="mt-0.5 text-[12px] text-fg-muted">{ex.summary}</p>
              <dl className="mt-3 space-y-1">
                {ex.fields.map((f, i) => (
                  <div key={i} className="flex justify-between gap-4 border-b border-border/60 pb-1 text-[12px]">
                    <dt className="font-mono text-fg-dim">{f.label}</dt>
                    <dd className="text-right text-fg-muted">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-1.5 font-mono text-[11px] text-accent-soft">
                {ex.signal}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
