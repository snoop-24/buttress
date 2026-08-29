import type { CampaignCreative } from "@/agents/campaign";

/**
 * Renders a generated CampaignCreative as an actual recruitment landing page —
 * the tangible artifact the Campaign agent produced. Deliberately light/warm so
 * it reads as a real recruitment website against the dark demo, inside a
 * browser-chrome frame to sell "this is a page we built live."
 */
export function GeneratedLandingPage({
  creative,
  trade,
  region,
}: {
  creative: CampaignCreative;
  trade?: string;
  region?: string;
}) {
  const host = `become-a-${(trade ?? "tradesperson").toLowerCase()}.jobs`;
  return (
    <div className="overflow-hidden rounded-xl border border-border-strong">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-bg-elevated px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="ml-2 rounded bg-bg px-2 py-0.5 font-mono text-[10px] text-fg-dim">{host}</span>
        <span className="ml-auto font-mono text-[10px] text-good">● generated live</span>
      </div>

      {/* The page itself — light/warm */}
      <div style={{ background: "#f6f1e9", color: "#1b1710" }} className="px-6 py-7">
        {region && (
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
            style={{ background: "#fbe4cd", color: "#8a4b16" }}
          >
            Now hiring · {region}
          </span>
        )}
        <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          {creative.landing.headline}
        </h3>
        <p className="mt-2 text-[15px]" style={{ color: "#5c5343" }}>
          {creative.landing.subhead}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            className="rounded-full px-5 py-2.5 text-[14px] font-semibold text-white"
            style={{ background: "#e0701f" }}
          >
            {creative.landing.cta}
          </button>
          <span className="text-[12px] font-medium" style={{ color: "#7a6f5b" }}>
            No experience · Paid training · 8 weeks
          </span>
        </div>

        <p className="mt-5 text-[13.5px] leading-relaxed" style={{ color: "#403a2e" }}>
          {creative.landing.body}
        </p>

        {/* Mock apply form — looks real, does nothing */}
        <div className="mt-5 rounded-lg p-4" style={{ background: "#efe7da" }}>
          <p className="mb-2 text-[12px] font-semibold" style={{ color: "#5c5343" }}>
            Check if you qualify — 2 minutes
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="min-w-[120px] flex-1 rounded-md px-3 py-2 text-[12px]" style={{ background: "#fff", color: "#9a927f" }}>
              Full name
            </div>
            <div className="min-w-[120px] flex-1 rounded-md px-3 py-2 text-[12px]" style={{ background: "#fff", color: "#9a927f" }}>
              Email or phone
            </div>
            <button className="rounded-md px-4 py-2 text-[12px] font-semibold text-white" style={{ background: "#1b1710" }}>
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Ad variants the same campaign produced */}
      {creative.social.length > 0 && (
        <div className="border-t border-border bg-bg-card p-4">
          <p className="eyebrow mb-2">+ matching ad variants</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {creative.social.map((s) => (
              <div key={s.platform} className="rounded-lg border border-border bg-bg-elevated/50 p-3">
                <p className="font-mono text-[10px] text-accent-soft">{s.platform}</p>
                <p className="mt-1 text-[11.5px] leading-snug text-fg-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
