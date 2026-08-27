/**
 * Intake Agent — the demand engine. Deterministic (plain code, no model):
 * it turns a project's phase schedule into a week-by-week labor-demand curve.
 *
 * This is deliberately shallow — it emits the demand signal and nothing more.
 * We model peak *concurrent* crew per trade per week (the max across phases
 * active that week), which is the binding constraint when deciding how many
 * people to hire. That assumption is surfaced in the UI.
 */

import type { Project, Trade } from "@/lib/domain";
import type { Agent, AgentContext, DemandTimeline, TradeDemandPoint } from "@/agents/types";

export function computeDemandTimeline(project: Project): DemandTimeline {
  const horizonWeeks = Math.max(0, ...project.phases.map((p) => p.endWeek));
  const points: TradeDemandPoint[] = [];
  const peakByTrade: DemandTimeline["peakByTrade"] = {};

  for (let week = 0; week < horizonWeeks; week++) {
    const active = project.phases.filter((p) => week >= p.startWeek && week < p.endWeek);
    const byTrade = new Map<Trade, number>();
    for (const phase of active) {
      for (const [trade, count] of Object.entries(phase.crew) as [Trade, number][]) {
        // Peak concurrent crew: the largest single phase demand this week.
        byTrade.set(trade, Math.max(byTrade.get(trade) ?? 0, count));
      }
    }
    for (const [trade, headcount] of byTrade) {
      points.push({ week, trade, headcount });
      const prev = peakByTrade[trade];
      if (!prev || headcount > prev.headcount) {
        peakByTrade[trade] = { headcount, startWeek: week };
      }
    }
  }

  return { projectId: project.id, region: project.region, horizonWeeks, points, peakByTrade };
}

export const intakeAgent: Agent<Project, DemandTimeline> = {
  id: "intake",
  name: "Intake Agent",
  role: "Ingests a project schedule and emits the labor-demand curve.",
  async run(project) {
    return computeDemandTimeline(project);
  },
};
