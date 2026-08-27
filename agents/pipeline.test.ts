import { describe, expect, it } from "vitest";
import { screenCandidates, CREDENTIAL_PATHS } from "@/agents/screening";
import { dispatchWorkers } from "@/agents/dispatch";
import { computeDemandTimeline } from "@/agents/intake";
import { forecastGaps } from "@/agents/forecaster";
import { DEMO_CANDIDATES, DEMO_FIRM, DEMO_PROJECT } from "@/data/seed";

const electricianGap = forecastGaps({
  timeline: computeDemandTimeline(DEMO_PROJECT),
  firm: DEMO_FIRM,
  projectStartDate: DEMO_PROJECT.startDate,
})[0];

describe("Screening agent", () => {
  it("maps every candidate to their trade's credential path and marks screened", () => {
    const screened = screenCandidates(DEMO_CANDIDATES);
    expect(screened).toHaveLength(DEMO_CANDIDATES.length);
    expect(screened.every((c) => c.stage === "screened")).toBe(true);
    expect(screened[0].path).toEqual(CREDENTIAL_PATHS.electrician);
  });
});

describe("Dispatch agent", () => {
  it("places exactly gap-many electricians onto the demand-creating job", () => {
    const assignments = dispatchWorkers({
      candidates: DEMO_CANDIDATES,
      gap: electricianGap,
      project: DEMO_PROJECT,
    });
    expect(assignments).toHaveLength(electricianGap.gap); // 12
    expect(assignments.every((a) => a.projectId === DEMO_PROJECT.id)).toBe(true);
    expect(assignments.every((a) => a.role === "Apprentice Electrician")).toBe(true);
    expect(assignments[0].startDate).toBe(electricianGap.neededByDate); // 2026-10-26
  });

  it("never places more than are available", () => {
    const few = DEMO_CANDIDATES.slice(0, 3);
    const assignments = dispatchWorkers({
      candidates: few,
      gap: electricianGap,
      project: DEMO_PROJECT,
    });
    expect(assignments).toHaveLength(3);
  });

  it("is deterministic", () => {
    const args = { candidates: DEMO_CANDIDATES, gap: electricianGap, project: DEMO_PROJECT };
    expect(dispatchWorkers(args)).toEqual(dispatchWorkers(args));
  });
});
