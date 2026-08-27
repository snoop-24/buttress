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

  it("finds exactly one gap — every other trade is fully staffed", () => {
    const gaps = forecastGaps(input);
    expect(gaps).toHaveLength(1);
    expect(gaps.map((g) => g.trade)).toEqual(["electrician"]);
  });

  it("is deterministic — identical output across runs", () => {
    expect(forecastGaps(input)).toEqual(forecastGaps(input));
  });
});

describe("Forecaster edge cases", () => {
  it("returns no gaps for an empty project", () => {
    const timeline = computeDemandTimeline({
      ...DEMO_PROJECT,
      phases: [],
    });
    expect(timeline.points).toEqual([]);
    expect(timeline.peakByTrade).toEqual({});
    expect(timeline.horizonWeeks).toBe(0);
    expect(
      forecastGaps({ timeline, firm: DEMO_FIRM, projectStartDate: DEMO_PROJECT.startDate }),
    ).toEqual([]);
  });

  it("breaks equal-gap ties deterministically by week then trade name", () => {
    // Two trades short by the same amount (2), reached the same week.
    const timeline = {
      projectId: "p",
      region: { city: "Phoenix", state: "AZ" },
      horizonWeeks: 1,
      points: [
        { week: 0, trade: "plumber" as const, headcount: 2 },
        { week: 0, trade: "carpenter" as const, headcount: 2 },
      ],
      peakByTrade: {
        plumber: { headcount: 2, startWeek: 0 },
        carpenter: { headcount: 2, startWeek: 0 },
      },
    };
    const firm = {
      id: "f",
      name: "T",
      region: { city: "Phoenix", state: "AZ" },
      roster: [
        { trade: "plumber" as const, count: 0 },
        { trade: "carpenter" as const, count: 0 },
      ],
    };
    const gaps = forecastGaps({ timeline, firm, projectStartDate: "2026-01-01" });
    // carpenter < plumber alphabetically, so it wins the tiebreak.
    expect(gaps.map((g) => g.trade)).toEqual(["carpenter", "plumber"]);
    expect(gaps).toEqual(forecastGaps({ timeline, firm, projectStartDate: "2026-01-01" }));
  });
});

describe("addWeeks", () => {
  it("adds whole weeks in UTC", () => {
    expect(addWeeks("2026-09-14", 6)).toBe("2026-10-26");
    expect(addWeeks("2026-09-14", 0)).toBe("2026-09-14");
  });
});
