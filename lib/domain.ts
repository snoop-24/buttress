/**
 * Core domain types for the workforce-supply-factory demo.
 *
 * These types are the shared vocabulary every agent speaks. They are
 * intentionally small and framework-free so each agent stays a plain,
 * testable input -> output function.
 */

/** The trades we model. The demo shortage is `electrician`. */
export type Trade =
  | "electrician"
  | "plumber"
  | "carpenter"
  | "hvac"
  | "ironworker"
  | "concrete";

export const TRADE_LABELS: Record<Trade, string> = {
  electrician: "Electrician",
  plumber: "Plumber",
  carpenter: "Carpenter",
  hvac: "HVAC Technician",
  ironworker: "Ironworker",
  concrete: "Concrete / Mason",
};

export interface Region {
  city: string;
  state: string; // 2-letter
}

/** How many people of a trade the firm currently employs. */
export interface RosterEntry {
  trade: Trade;
  count: number;
}

export interface Firm {
  id: string;
  name: string;
  region: Region;
  /** Current employed tradespeople, by trade. */
  roster: RosterEntry[];
}

/**
 * One phase of a project's schedule. `crew` is the PEAK simultaneous
 * headcount that phase needs, per trade, while it is active.
 */
export interface ProjectPhase {
  id: string;
  name: string;
  startWeek: number; // weeks from project start (0-based)
  endWeek: number; // exclusive
  crew: Partial<Record<Trade, number>>;
}

export interface Project {
  id: string;
  name: string;
  firmId: string;
  region: Region;
  /** ISO date the project (week 0) begins. */
  startDate: string;
  phases: ProjectPhase[];
}

/** Where a simulated career-switcher is in the recruitment funnel. */
export type FunnelStage =
  | "lead"
  | "applied"
  | "screened"
  | "enrolled"
  | "credentialed"
  | "dispatched";

export const FUNNEL_ORDER: FunnelStage[] = [
  "lead",
  "applied",
  "screened",
  "enrolled",
  "credentialed",
  "dispatched",
];

/**
 * A simulated inbound candidate. `simulated` is always true and is
 * surfaced on screen — inbound flow is honestly labeled simulation;
 * only campaign *creative* is genuinely model-generated.
 */
export interface Candidate {
  id: string;
  name: string;
  /** The white-collar / adjacent field they are switching from. */
  priorField: string;
  targetTrade: Trade;
  stage: FunnelStage;
  simulated: true;
}
