/**
 * Screening / Credentialing Agent — deterministic (no model).
 *
 * Qualifies a candidate and maps them onto a concrete credential path. We
 * deliberately target pre-apprentice / helper entry points partnered with
 * registered training programs, not a claim to compress a multi-year license —
 * that's the honest answer to "how do you credential fast?".
 */

import type { Agent } from "@/agents/types";
import type { Candidate, Trade } from "@/lib/domain";

export interface CredentialPath {
  trade: Trade;
  /** Program name shown on screen. */
  name: string;
  /** The stackable credential the entry role requires. */
  credential: string;
  /** Weeks to job-ready for the entry (helper / pre-apprentice) role. */
  weeks: number;
}

/** Entry-role credential paths per trade. */
export const CREDENTIAL_PATHS: Record<Trade, CredentialPath> = {
  electrician: {
    trade: "electrician",
    name: "Electrical Pre-Apprenticeship",
    credential: "NCCER Core + OSHA-10 + Electrical Level 1",
    weeks: 8,
  },
  plumber: {
    trade: "plumber",
    name: "Plumbing Pre-Apprenticeship",
    credential: "NCCER Core + OSHA-10 + Plumbing Level 1",
    weeks: 8,
  },
  carpenter: {
    trade: "carpenter",
    name: "Carpentry Pre-Apprenticeship",
    credential: "NCCER Core + OSHA-10 + Carpentry Level 1",
    weeks: 6,
  },
  hvac: {
    trade: "hvac",
    name: "HVAC Pre-Apprenticeship",
    credential: "EPA 608 + OSHA-10 + HVAC Level 1",
    weeks: 10,
  },
  ironworker: {
    trade: "ironworker",
    name: "Ironworking Pre-Apprenticeship",
    credential: "OSHA-10 + Rigging & Signalperson Basics",
    weeks: 8,
  },
  concrete: {
    trade: "concrete",
    name: "Concrete / Masonry Pre-Apprenticeship",
    credential: "OSHA-10 + ACI Concrete Basics",
    weeks: 6,
  },
};

export interface ScreenedCandidate extends Candidate {
  path: CredentialPath;
}

export function screenCandidates(candidates: Candidate[]): ScreenedCandidate[] {
  return candidates.map((c) => ({
    ...c,
    path: CREDENTIAL_PATHS[c.targetTrade],
    stage: "screened",
  }));
}

export const screeningAgent: Agent<Candidate[], ScreenedCandidate[]> = {
  id: "screening",
  name: "Screening / Credentialing Agent",
  role: "Qualifies candidates and maps each to a credential / apprenticeship path.",
  async run(candidates) {
    return screenCandidates(candidates);
  },
};
