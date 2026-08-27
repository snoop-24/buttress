import { describe, expect, it } from "vitest";
import { runLoop, type NodeId } from "@/lib/run";
import { DEMO_CANDIDATES, DEMO_FIRM, DEMO_PROJECT } from "@/data/seed";

describe("runLoop (end-to-end, demoMode)", () => {
  it("closes the loop with the hero numbers", async () => {
    const r = await runLoop(DEMO_FIRM, DEMO_PROJECT, DEMO_CANDIDATES, { demoMode: true });

    // The gap signal
    expect(r.gap.trade).toBe("electrician");
    expect(r.gap.gap).toBe(12);
    expect(r.gap.neededByDate).toBe("2026-10-26");

    // The simulated pipeline
    expect(r.funnel.pipeline).toBe(12);
    expect(r.funnel.dispatched).toBe(12);

    // Loop closes: 12 workers placed on the demand-creating project
    expect(r.assignments).toHaveLength(12);
    expect(r.assignments.every((a) => a.projectId === DEMO_PROJECT.id)).toBe(true);

    // The deterministic headline
    expect(r.efficiency.speedMultiple).toBe(7);
    expect(r.efficiency.volumeMultiple).toBe(3);
    expect(r.efficiency.throughputMultiple).toBe(21);

    // Creative present (pre-baked in demoMode)
    expect(r.creative.landing.cta.length).toBeGreaterThan(0);
    expect(r.nurture.body.length).toBeGreaterThan(0);
  });

  it("fires every node step in loop order", async () => {
    const steps: NodeId[] = [];
    await runLoop(DEMO_FIRM, DEMO_PROJECT, DEMO_CANDIDATES, {
      demoMode: true,
      onStep: (s) => {
        steps.push(s.node);
      },
    });
    expect(steps).toEqual([
      "intake",
      "forecaster",
      "campaign",
      "nurture",
      "screening",
      "dispatch",
      "metrics",
    ]);
  });

  it("is deterministic in demoMode", async () => {
    const a = await runLoop(DEMO_FIRM, DEMO_PROJECT, DEMO_CANDIDATES, { demoMode: true });
    const b = await runLoop(DEMO_FIRM, DEMO_PROJECT, DEMO_CANDIDATES, { demoMode: true });
    expect(a).toEqual(b);
  });
});
