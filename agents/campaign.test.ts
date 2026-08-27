import { describe, expect, it } from "vitest";
import {
  CampaignCreativeSchema,
  PREBAKED_CAMPAIGN,
  generateCampaign,
  type CampaignInput,
} from "@/agents/campaign";

const INPUT: CampaignInput = {
  trade: "electrician",
  regionLabel: "Phoenix, AZ",
  gapCount: 12,
  neededByDate: "2026-10-26",
  firmName: "Sunbelt Structures",
  priorFields: ["Warehouse / logistics", "Call-center support", "Junior data analyst"],
};

describe("Campaign agent", () => {
  it("pre-baked creative satisfies the schema", () => {
    expect(() => CampaignCreativeSchema.parse(PREBAKED_CAMPAIGN)).not.toThrow();
    expect(PREBAKED_CAMPAIGN.social.length).toBe(3);
  });

  it("demoMode returns the pre-baked creative with no network call", async () => {
    const creative = await generateCampaign(INPUT, { demoMode: true });
    expect(creative).toEqual(PREBAKED_CAMPAIGN);
  });
});
