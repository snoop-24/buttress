import { describe, expect, it } from "vitest";
import { computeEfficiency, DEFAULT_BASELINE } from "@/lib/metrics";

const DEMO_MEASURED = { recruiters: 0, days: 6, pipeline: 12 };

describe("computeEfficiency", () => {
  it("derives the hero-demo multiples: 7x speed, 3x volume, 21x throughput", () => {
    const r = computeEfficiency(DEMO_MEASURED);
    expect(r.speedMultiple).toBe(7); // 42 / 6
    expect(r.volumeMultiple).toBe(3); // 12 / 4
    expect(r.throughputMultiple).toBe(21); // (12/6) / (4/42)
  });

  it("is deterministic across runs", () => {
    expect(computeEfficiency(DEMO_MEASURED)).toEqual(computeEfficiency(DEMO_MEASURED));
  });

  it("surfaces the cited baseline assumptions", () => {
    const r = computeEfficiency(DEMO_MEASURED);
    expect(r.assumptions.length).toBeGreaterThan(0);
    expect(r.baseline).toEqual(DEFAULT_BASELINE);
  });

  it("guards divide-by-zero inputs to 0, never Infinity/NaN", () => {
    const r = computeEfficiency({ recruiters: 0, days: 0, pipeline: 12 });
    expect(r.speedMultiple).toBe(0);
    expect(r.throughputMultiple).toBe(0);
    expect(Number.isFinite(r.volumeMultiple)).toBe(true);
  });
});
