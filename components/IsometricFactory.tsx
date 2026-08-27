/**
 * The hero visual — a tilted, floating "factory" dashboard in the Sprint
 * isometric style. It literally shows the loop: PAPERWORK being auto-processed
 * on the left lane (the demand engine) and the OUTBOUND recruiting funnel
 * filling on the right (the supply factory), joined by a demand→supply arc.
 * CSS-only animation, so it runs in a server component.
 */

const PAPERWORK = [
  "Project schedule",
  "Trade takeoff",
  "Permit set",
  "Submittal log",
  "Change order",
];

const FUNNEL = [
  { label: "Leads", n: 30, w: "100%" },
  { label: "Applied", n: 24, w: "80%" },
  { label: "Screened", n: 20, w: "67%" },
  { label: "Enrolled", n: 16, w: "53%" },
  { label: "Credentialed", n: 12, w: "40%" },
];

export function IsometricFactory() {
  return (
    <div className="relative mx-auto w-full max-w-5xl [perspective:1700px]">
      {/* Static isometric tilt (Sprint signature) */}
      <div
        style={{
          transform: "rotateX(19deg) rotateY(-25deg) rotateZ(2deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Float animation lives on an inner element so it doesn't clobber the tilt */}
        <div style={{ animation: "floatPanel 7s ease-in-out infinite" }}>
        <div
          className="grid grid-cols-2 gap-5 rounded-2xl border border-border-strong bg-bg-card p-5"
          style={{ boxShadow: "0 60px 120px -40px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.02)" }}
        >
          {/* Lane A — paperwork automation (demand engine) */}
          <div className="rounded-xl border border-border bg-bg-elevated/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="eyebrow">Back office · automated</span>
              <span className="font-mono text-[10px] text-good">● live</span>
            </div>
            <div className="space-y-2">
              {PAPERWORK.map((doc, i) => (
                <div
                  key={doc}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-[12px]"
                  style={{ animation: `rowProcess 5s ease-in-out ${i * 0.5}s infinite` }}
                >
                  <span className="text-fg-muted">{doc}</span>
                  <span
                    className="font-mono text-[11px] text-good"
                    style={{ animation: `checkIn 5s ease-in-out ${i * 0.5}s infinite` }}
                  >
                    ✓ parsed
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 font-mono text-[11px] text-accent-soft">
              → 12 electricians short · Phoenix · wk 6
            </div>
          </div>

          {/* Lane B — outbound recruiting (supply factory) */}
          <div className="rounded-xl border border-border bg-bg-elevated/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="eyebrow">Outbound · recruiting</span>
              <span className="font-mono text-[10px] text-fg-dim">simulated</span>
            </div>
            <div className="mb-3 rounded-lg border border-border bg-bg-card px-3 py-2">
              <div className="text-[12px] font-medium text-fg">Become an electrician in Phoenix</div>
              <div className="text-[11px] text-fg-muted">Paid training · 8 weeks · no experience</div>
            </div>
            <div className="space-y-1.5">
              {FUNNEL.map((s, i) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="w-20 shrink-0 font-mono text-[10px] text-fg-dim">{s.label}</span>
                  <div className="h-4 flex-1 overflow-hidden rounded-sm bg-bg-card">
                    <div
                      className="h-full origin-left rounded-sm bg-gradient-to-r from-accent to-accent-soft"
                      style={{ width: s.w, animation: `barGrow 1s ease-out ${0.4 + i * 0.25}s both` }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-[11px] text-fg">{s.n}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-good/30 bg-good/5 px-3 py-2 font-mono text-[11px] text-good">
              → 12 dispatched to the job that created the gap
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
