/**
 * Simulated recruitment funnel — deterministic.
 *
 * Inbound candidate flow is SIMULATED (and labeled as such on screen); only
 * campaign creative is genuinely model-generated. This engine turns a lead
 * pool and the target gap into a reproducible stage-by-stage cascade, so the
 * "12 in pipeline" number is as traceable as the rest of the demo.
 *
 * Counts are cumulative ("reached at least this stage"), the standard funnel
 * reading: everyone who was dispatched was also credentialed, enrolled, etc.
 */

import type { FunnelStage } from "@/lib/domain";

/** Stage-to-stage retention. Chosen so a 30-lead pool lands on 24/20/16/12 exactly. */
export const FUNNEL_RETENTION: { stage: FunnelStage; rate: number }[] = [
  { stage: "applied", rate: 0.8 }, // 30 -> 24
  { stage: "screened", rate: 5 / 6 }, // 24 -> 20
  { stage: "enrolled", rate: 0.8 }, // 20 -> 16
  { stage: "credentialed", rate: 0.75 }, // 16 -> 12
];

export interface FunnelResult {
  /** Cumulative count that reached each stage. */
  counts: Record<FunnelStage, number>;
  /** Ordered stages, for driving the UI. */
  order: FunnelStage[];
  /** Candidates credentialed and ready — the "in pipeline" headline count. */
  pipeline: number;
  /** Credentialed workers actually placed on the job (capped by the gap). */
  dispatched: number;
}

/**
 * Pure, reproducible. `dispatched` is capped at the gap so we never claim to
 * place more workers than the job needs.
 */
export function computeFunnel(poolSize: number, gap: number): FunnelResult {
  const counts = { lead: poolSize } as Record<FunnelStage, number>;
  let current = poolSize;
  for (const { stage, rate } of FUNNEL_RETENTION) {
    current = Math.round(current * rate);
    counts[stage] = current;
  }
  const pipeline = counts.credentialed;
  const dispatched = Math.min(pipeline, Math.max(0, gap));
  counts.dispatched = dispatched;

  return {
    counts,
    order: ["lead", "applied", "screened", "enrolled", "credentialed", "dispatched"],
    pipeline,
    dispatched,
  };
}

/**
 * A snapshot of the funnel at animation progress `t` in [0, 1], for counting
 * the stages up on screen. Stages fill in cascade (upstream first) so the flow
 * reads left-to-right. Deterministic given the same result and t.
 */
export function funnelSnapshot(result: FunnelResult, t: number): Record<FunnelStage, number> {
  const clamped = Math.min(1, Math.max(0, t));
  const n = result.order.length;
  const snapshot = {} as Record<FunnelStage, number>;
  result.order.forEach((stage, i) => {
    // Each stage opens at a staggered offset and fills over the same window.
    const start = i / (n + 1);
    const stageProgress = Math.min(1, Math.max(0, (clamped - start) / (1 / (n + 1) + 0.0001)));
    snapshot[stage] = Math.round(result.counts[stage] * stageProgress);
  });
  return snapshot;
}
