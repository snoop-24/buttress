"use client";

import { useState } from "react";
import { SAMPLE_DOCS } from "@/data/sample-docs";
import { demandToProject, type ProcessedDoc } from "@/agents/paperwork";
import { computeDemandTimeline } from "@/agents/intake";
import { forecastGaps } from "@/agents/forecaster";
import { DEMO_FIRM } from "@/data/seed";
import { TRADE_LABELS } from "@/lib/domain";
import type { LaborGap } from "@/agents/types";

/**
 * Interactive back-office automation: pick or paste a real construction
 * document, and Buttress classifies + extracts it live (Groq via /api/paperwork).
 * For a schedule it derives the labor gap deterministically on top of the
 * extraction. Used on the landing (#backoffice) and the demo page.
 */
export function PaperworkProcessor() {
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
