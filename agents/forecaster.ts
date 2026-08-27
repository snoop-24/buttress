/**
 * Labor Gap Forecaster — deterministic (plain code, no model). It compares
 * the demand curve from Intake against the firm's current roster and returns
 * the trades that will be short: how many, and by when.
 *
 * This is the demand *signal* the whole supply factory acts on, so it is a
 * pure function and is unit-tested for reproducibility.
 */

import type { Firm, Trade } from "@/lib/domain";
import type { Agent, DemandTimeline, LaborGap } from "@/agents/types";

export interface ForecastInput {
  timeline: DemandTimeline;
  firm: Firm;
  /** ISO date of project week 0, used to date the gap. */
  projectStartDate: string;
}

/** ISO date `weeks` after an ISO start date (UTC, no time component). */
export function addWeeks(startDateIso: string, weeks: number): string {
  const d = new Date(`${startDateIso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + weeks * 7);
  return d.toISOString().slice(0, 10);
}

export function forecastGaps(input: ForecastInput): LaborGap[] {
  const { timeline, firm, projectStartDate } = input;
  const rosterOf = (trade: Trade) =>
    firm.roster.find((r) => r.trade === trade)?.count ?? 0;

  const gaps: LaborGap[] = [];
  for (const [tradeKey, peak] of Object.entries(timeline.peakByTrade)) {
    const trade = tradeKey as Trade;
    if (!peak) continue;
    const available = rosterOf(trade);
    const gap = Math.max(0, peak.headcount - available);
    if (gap <= 0) continue;

    // First week the trade's demand exceeds the roster.
    const firstExceed = timeline.points
      .filter((p) => p.trade === trade && p.headcount > available)
      .reduce((min, p) => Math.min(min, p.week), Number.POSITIVE_INFINITY);
    const neededByWeek = Number.isFinite(firstExceed) ? firstExceed : peak.startWeek;

    gaps.push({
      trade,
      region: timeline.region,
      needed: peak.headcount,
      available,
      gap,
      neededByWeek,
      neededByDate: addWeeks(projectStartDate, neededByWeek),
    });
  }

  // Largest, soonest gaps first — the ones worth acting on.
  gaps.sort((a, b) => b.gap - a.gap || a.neededByWeek - b.neededByWeek);
  return gaps;
}

export const forecasterAgent: Agent<ForecastInput, LaborGap[]> = {
  id: "forecaster",
  name: "Labor Gap Forecaster",
  role: "Compares demand against roster to flag which trades fall short, and when.",
  async run(input) {
    return forecastGaps(input);
  },
};
