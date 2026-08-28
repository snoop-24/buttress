import { describe, expect, it } from "vitest";
import { emitFleet } from "@/factory/emit";
import { DEMO_FIRM } from "@/data/seed";

describe("emitFleet", () => {
  const files = emitFleet(DEMO_FIRM);

  it("emits the expected owned-fleet files", () => {
    const paths = files.map((f) => f.path);
    expect(paths).toEqual([
      "sunbelt-structures-fleet/README.md",
      "sunbelt-structures-fleet/config.ts",
      "sunbelt-structures-fleet/agents/forecaster.ts",
      "sunbelt-structures-fleet/agents/campaign.ts",
      "sunbelt-structures-fleet/agents/dispatch.ts",
      "sunbelt-structures-fleet/run.ts",
    ]);
  });

  it("parameterizes the code to the firm (name, region, roster)", () => {
    const config = files.find((f) => f.path.endsWith("config.ts"))!.content;
    expect(config).toContain('name: "Sunbelt Structures"');
    expect(config).toContain('city: "Phoenix"');
    expect(config).toContain("electrician: 6,");
  });

  it("emits non-empty content for every file", () => {
    expect(files.every((f) => f.content.trim().length > 0)).toBe(true);
  });

  it("is deterministic", () => {
    expect(emitFleet(DEMO_FIRM)).toEqual(emitFleet(DEMO_FIRM));
  });
});
