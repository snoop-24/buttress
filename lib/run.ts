/**
 * The run orchestrator — wires the six-node loop end to end and returns every
 * intermediate result plus the deterministic efficiency report. This is what
 * the demo page drives: one call plays the whole loop.
 *
 * Campaign (and optionally Nurture) generation is INJECTABLE so the browser can
 * route it through /api/campaign (key stays server-side) while tests and server
 * runs use the local generators. Everything else is deterministic.
 */

import type { AgentContext, DemandTimeline, LaborGap } from "@/agents/types";
import type { Candidate, Firm, Project } from "@/lib/domain";
import { computeDemandTimeline } from "@/agents/intake";
import { forecastGaps } from "@/agents/forecaster";
import {
  generateCampaign as defaultGenerateCampaign,
  type CampaignCreative,
  type CampaignInput,
} from "@/agents/campaign";
import {
  generateNurture as defaultGenerateNurture,
  type NurtureInput,
  type NurtureMessage,
} from "@/agents/nurture";
import { screenCandidates, CREDENTIAL_PATHS, type ScreenedCandidate } from "@/agents/screening";
import { dispatchWorkers, type Assignment } from "@/agents/dispatch";
import { computeFunnel, type FunnelResult } from "@/lib/funnel";
import { computeEfficiency, type EfficiencyReport } from "@/lib/metrics";

export type NodeId =
  | "intake"
  | "forecaster"
  | "campaign"
  | "nurture"
  | "screening"
  | "dispatch"
  | "metrics";

export interface RunStep {
  node: NodeId;
  label: string;
}

export interface RunResult {
  demandTimeline: DemandTimeline;
  gaps: LaborGap[];
  /** The top gap the loop acts on. */
  gap: LaborGap;
  creative: CampaignCreative;
  nurture: NurtureMessage;
  funnel: FunnelResult;
  screened: ScreenedCandidate[];
  assignments: Assignment[];
  efficiency: EfficiencyReport;
}

export interface RunOptions {
  demoMode?: boolean;
  /** Simulated days from campaign launch to filled pipeline (drives the metric). */
  measuredDays?: number;
  generateCampaign?: (input: CampaignInput, ctx: AgentContext) => Promise<CampaignCreative>;
  generateNurture?: (input: NurtureInput, ctx: AgentContext) => Promise<NurtureMessage>;
  /** Called as each node completes, for the UI to light the loop in sequence. */
  onStep?: (step: RunStep) => void | Promise<void>;
}

const NODE_LABELS: Record<NodeId, string> = {
  intake: "Intake Agent",
  forecaster: "Labor Gap Forecaster",
  campaign: "Campaign Agent",
  nurture: "Nurture Agent",
  screening: "Screening / Credentialing Agent",
  dispatch: "Dispatch Agent",
  metrics: "Efficiency Metric",
};

function regionLabel(firm: Firm): string {
  return `${firm.region.city}, ${firm.region.state}`;
}

/** Up to `n` distinct prior fields from the candidate pool, for ad targeting. */
function distinctPriorFields(candidates: Candidate[], n = 4): string[] {
  return [...new Set(candidates.map((c) => c.priorField))].slice(0, n);
}

export async function runLoop(
  firm: Firm,
  project: Project,
  candidates: Candidate[],
  opts: RunOptions = {},
): Promise<RunResult> {
  const {
    demoMode = false,
    measuredDays = 6,
    generateCampaign = defaultGenerateCampaign,
    generateNurture = defaultGenerateNurture,
    onStep,
  } = opts;
  const ctx: AgentContext = { demoMode };
  const step = async (node: NodeId) => onStep?.({ node, label: NODE_LABELS[node] });

  // 1. Intake — project schedule -> labor-demand curve.
  const demandTimeline = computeDemandTimeline(project);
  await step("intake");

  // 2. Forecaster — the gap signal.
  const gaps = forecastGaps({ timeline: demandTimeline, firm, projectStartDate: project.startDate });
  const gap = gaps[0];
  await step("forecaster");

  // 3. Campaign — the live generative wedge.
  const creative = await generateCampaign(
    {
      trade: gap.trade,
      regionLabel: regionLabel(firm),
      gapCount: gap.gap,
      neededByDate: gap.neededByDate,
      firmName: firm.name,
      priorFields: distinctPriorFields(candidates),
    },
    ctx,
  );
  await step("campaign");

  // 4. Nurture — one outreach message; inflow itself is simulated.
  const path = CREDENTIAL_PATHS[gap.trade];
  const nurture = await generateNurture(
    { trade: gap.trade, regionLabel: regionLabel(firm), firmName: firm.name, pathName: path.name, weeks: path.weeks },
    ctx,
  );
  await step("nurture");

  // 5. Screening — map candidates to credential paths.
  const screened = screenCandidates(candidates);
  await step("screening");

  // Simulated funnel cascade (labeled) — how many reach each stage.
  const funnel = computeFunnel(candidates.length, gap.gap);

  // 6. Dispatch — place the credentialed workers onto the demand-creating job.
  const credentialed = screened.slice(0, funnel.dispatched);
  const assignments = dispatchWorkers({ candidates: credentialed, gap, project });
  await step("dispatch");

  // Deterministic efficiency multiple — the headline.
  const efficiency = computeEfficiency({ recruiters: 0, days: measuredDays, pipeline: funnel.pipeline });
  await step("metrics");

  return { demandTimeline, gaps, gap, creative, nurture, funnel, screened, assignments, efficiency };
}
