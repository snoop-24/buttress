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

        <p className="mt-5 line-clamp-3 text-[13.5px] leading-relaxed" style={{ color: "#403a2e" }}>
          {creative.landing.body}
        </p>
      </div>

      {/* The same campaign also produced per-channel ad variants — collapsed to a
          single line so the card reads as one scannable result, not a wall. */}
      {creative.social.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border bg-bg-card px-4 py-3">
          <span className="eyebrow">+ {creative.social.length} channel variants generated</span>
          <span className="font-mono text-[11px] text-fg-dim">
            {creative.social.map((s) => s.platform).join(" · ")}
          </span>
        </div>
      )}
    </div>
  );
}
