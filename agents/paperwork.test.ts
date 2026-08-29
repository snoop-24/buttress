import { describe, expect, it } from "vitest";
import {
  processDocument,
  demandToProject,
  PREBAKED_SCHEDULE,
  ProcessedDocSchema,
} from "@/agents/paperwork";
import { computeDemandTimeline } from "@/agents/intake";
import { forecastGaps } from "@/agents/forecaster";
import { DEMO_FIRM } from "@/data/seed";

describe("Paperwork agent", () => {
  it("prebaked schedule satisfies the schema and carries demand", () => {
    expect(() => ProcessedDocSchema.parse(PREBAKED_SCHEDULE)).not.toThrow();
    expect(PREBAKED_SCHEDULE.demand?.phases.length).toBe(5);
  });

  it("demoMode returns the prebaked parse with no network", async () => {
    const r = await processDocument("anything", { demoMode: true });
    expect(r).toEqual(PREBAKED_SCHEDULE);
  });

  it("extracted demand flows through the forecaster to the 12-electrician gap", () => {
    const project = demandToProject(PREBAKED_SCHEDULE.demand!, DEMO_FIRM.id, DEMO_FIRM.region);
    const timeline = computeDemandTimeline(project);
    const gaps = forecastGaps({ timeline, firm: DEMO_FIRM, projectStartDate: project.startDate });
    expect(gaps[0]).toMatchObject({ trade: "electrician", gap: 12, neededByWeek: 6 });
  });
});
