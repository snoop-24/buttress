import { describe, expect, it } from "vitest";
import { computeFunnel, funnelSnapshot } from "@/lib/funnel";

describe("computeFunnel", () => {
  it("cascades the 30-lead demo pool to 24/20/16/12 and 12 in pipeline", () => {
    const r = computeFunnel(30, 12);
    expect(r.counts).toEqual({
      lead: 30,
      applied: 24,
      screened: 20,
      enrolled: 16,
      credentialed: 12,
      dispatched: 12,
    });
    expect(r.pipeline).toBe(12);
    expect(r.dispatched).toBe(12);
  });

  it("never dispatches more workers than the gap", () => {
    const r = computeFunnel(30, 5);
    expect(r.pipeline).toBe(12);
    expect(r.dispatched).toBe(5);
  });

  it("is deterministic", () => {
    expect(computeFunnel(30, 12)).toEqual(computeFunnel(30, 12));
  });
});

describe("funnelSnapshot", () => {
  it("is empty at t=0 and reaches finals at t=1", () => {
    const r = computeFunnel(30, 12);
    const start = funnelSnapshot(r, 0);
    expect(Object.values(start).every((v) => v === 0)).toBe(true);
    expect(funnelSnapshot(r, 1)).toEqual(r.counts);
  });

  it("is monotonic and deterministic across progress", () => {
    const r = computeFunnel(30, 12);
    const a = funnelSnapshot(r, 0.5);
    const b = funnelSnapshot(r, 0.5);
    expect(a).toEqual(b);
    // Upstream stages are never behind downstream ones at the same t.
    expect(a.lead).toBeGreaterThanOrEqual(a.dispatched);
  });
});
