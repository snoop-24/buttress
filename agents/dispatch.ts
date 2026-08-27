/**
 * Dispatch Agent — deterministic (no model). Places credentialed workers onto
 * the exact job that generated the demand, closing the loop. Assigns at most
 * the gap size — never more workers than the job needs.
 */

import type { Agent, LaborGap } from "@/agents/types";
import type { Candidate, Project, Trade } from "@/lib/domain";
import { TRADE_LABELS } from "@/lib/domain";

export interface DispatchInput {
  /** Credentialed, job-ready candidates. */
  candidates: Candidate[];
  gap: LaborGap;
  project: Project;
}

export interface Assignment {
  candidateId: string;
  candidateName: string;
  projectId: string;
  projectName: string;
  trade: Trade;
  /** The entry role they fill, e.g. "Apprentice Electrician". */
  role: string;
  /** ISO date they are needed on the job (from the gap). */
  startDate: string;
}

function entryRole(trade: Trade): string {
  return `Apprentice ${TRADE_LABELS[trade]}`;
}

export function dispatchWorkers(input: DispatchInput): Assignment[] {
  const { candidates, gap, project } = input;
  const eligible = candidates.filter((c) => c.targetTrade === gap.trade);
  const toPlace = eligible.slice(0, Math.max(0, gap.gap));
  return toPlace.map((c) => ({
    candidateId: c.id,
    candidateName: c.name,
    projectId: project.id,
    projectName: project.name,
    trade: gap.trade,
    role: entryRole(gap.trade),
    startDate: gap.neededByDate,
  }));
}

export const dispatchAgent: Agent<DispatchInput, Assignment[]> = {
  id: "dispatch",
  name: "Dispatch Agent",
  role: "Places credentialed workers onto the job that created the demand.",
  async run(input) {
    return dispatchWorkers(input);
  },
};
