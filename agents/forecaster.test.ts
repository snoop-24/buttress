import { describe, expect, it } from "vitest";
import { computeDemandTimeline } from "@/agents/intake";
import { forecastGaps, addWeeks } from "@/agents/forecaster";
import { DEMO_FIRM, DEMO_PROJECT } from "@/data/seed";

describe("Intake demand timeline", () => {
  it("derives peak electrician demand of 18 starting week 6", () => {
    const timeline = computeDemandTimeline(DEMO_PROJECT);
    expect(timeline.peakByTrade.electrician).toEqual({ headcount: 18, startWeek: 6 });
  });
});

describe("Forecaster gap signal", () => {
  const input = {
    timeline: computeDemandTimeline(DEMO_PROJECT),
    firm: DEMO_FIRM,
    projectStartDate: DEMO_PROJECT.startDate,
  };

  it("flags the hero-demo electrician gap: 12 short, needed week 6", () => {
    const gaps = forecastGaps(input);
    const elec = gaps.find((g) => g.trade === "electrician");
    expect(elec).toMatchObject({
      needed: 18,
      available: 6,
      gap: 12,
      neededByWeek: 6,
      neededByDate: "2026-10-26",
    });
  });

  it("ranks electrician as the top gap", () => {
    const gaps = forecastGaps(input);
    expect(gaps[0].trade).toBe("electrician");
  });

  it("is deterministic — identical output across runs", () => {
    expect(forecastGaps(input)).toEqual(forecastGaps(input));
  });
});

describe("addWeeks", () => {
  it("adds whole weeks in UTC", () => {
    expect(addWeeks("2026-09-14", 6)).toBe("2026-10-26");
    expect(addWeeks("2026-09-14", 0)).toBe("2026-09-14");
  });
});
