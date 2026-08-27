/**
 * The agent contract. Every node in the loop is an Agent: a named,
 * single-purpose unit with a typed input and a typed output. Deterministic
 * agents ignore the LLM in `ctx`; generative agents use it. Keeping this
 * contract uniform is what lets the factory wire the fleet mechanically and
 * lets each agent be understood and tested on its own.
 */

import type { Region, Trade } from "@/lib/domain";

/** Shared services handed to every agent at run time. */
export interface AgentContext {
  /**
   * When true, generative agents return pre-baked output instead of calling
   * the model — the offline-safe path for a live stage demo.
   */
  demoMode: boolean;
}

export interface Agent<Input, Output> {
  /** Machine id, e.g. "forecaster". */
  readonly id: string;
  /** Human label shown in the UI, e.g. "Labor Gap Forecaster". */
  readonly name: string;
  /** One line describing what this node does. */
  readonly role: string;
  run(input: Input, ctx: AgentContext): Promise<Output>;
}

// --- Intake output: the labor-demand curve ------------------------------

/** Peak concurrent headcount of one trade in one week. */
export interface TradeDemandPoint {
  week: number;
  trade: Trade;
  headcount: number;
}

export interface DemandTimeline {
  projectId: string;
  region: Region;
  /** Number of weeks modeled (0..horizonWeeks-1). */
  horizonWeeks: number;
  /** week x trade grid of peak concurrent demand. */
  points: TradeDemandPoint[];
  /** Convenience: the peak demand per trade and the week it starts. */
  peakByTrade: Partial<Record<Trade, { headcount: number; startWeek: number }>>;
}

// --- Forecaster output: the gap signal ----------------------------------

export interface LaborGap {
  trade: Trade;
  region: Region;
  /** Peak concurrent demand for the trade. */
  needed: number;
  /** Current roster count for the trade. */
  available: number;
  /** needed - available, floored at 0 (only positive gaps are returned). */
  gap: number;
  /** First week where demand exceeds the roster. */
  neededByWeek: number;
  /** ISO date corresponding to neededByWeek. */
  neededByDate: string;
}
