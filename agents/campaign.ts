/**
 * Campaign Agent — THE wedge. This is the one genuinely generative node: it
 * writes real recruitment creative (ad, landing page, social) targeted at
 * career-switchers in a specific trade + region, live on Groq.
 *
 * Every live path has a pre-baked fallback (demoMode or any error), so the
 * on-stage run can never hard-fail — it degrades to hand-written creative that
 * looks identical on screen.
 */

import { z } from "zod";
import type { Agent, AgentContext } from "@/agents/types";
import type { Trade } from "@/lib/domain";
import { getGroq, GROQ_MODEL } from "@/lib/groq";

export const CampaignCreativeSchema = z.object({
  adHeadline: z.string(),
  adBody: z.string(),
  landing: z.object({
    headline: z.string(),
    subhead: z.string(),
    cta: z.string(),
    body: z.string(),
  }),
  social: z
    .array(z.object({ platform: z.string(), text: z.string() }))
    .min(1),
});

export type CampaignCreative = z.infer<typeof CampaignCreativeSchema>;

export interface CampaignInput {
  trade: Trade;
  /** e.g. "Phoenix, AZ" */
  regionLabel: string;
  /** How many workers short. */
  gapCount: number;
  /** ISO date the workers are needed on the job. */
  neededByDate: string;
  firmName: string;
  /** Where the target career-switchers are coming from. */
  priorFields: string[];
}

/** Hand-written fallback creative (electrician / Phoenix). Shown in demoMode
 * and whenever a live generation fails — it must read as good as the real thing. */
export const PREBAKED_CAMPAIGN: CampaignCreative = {
  adHeadline: "Laid off by a screen? Get hired by a city.",
  adBody:
    "Phoenix is short 12 electricians on projects breaking ground this fall. No experience needed — we get you OSHA-10 certified and into a paid pre-apprenticeship in 8 weeks. Trade your severance for a trade.",
  landing: {
    headline: "Become an electrician in Phoenix. Start in 8 weeks.",
    subhead:
      "Career-switchers welcome. Paid training, real jobs waiting, no degree required.",
    cta: "Check if you qualify",
    body:
      "The work that can't be automated is hiring. Sunbelt Structures needs 12 electricians for projects starting October 26. We take you from wherever you are now — warehouse, retail, driving, a cubicle — to a credentialed apprentice electrician, then place you directly on the job. OSHA-10 + NCCER Core, paid, 8 weeks.",
  },
  social: [
    {
      platform: "Instagram",
      text: "Your last job could be automated. This one can't. Phoenix needs 12 electricians — we'll train you and pay you to start. Link in bio.",
    },
    {
      platform: "TikTok",
      text: "POV: you left a dying desk job and 8 weeks later you're a paid apprentice electrician making things that stay built. Phoenix is hiring.",
    },
    {
      platform: "LinkedIn",
      text: "The trades are the soft landing white-collar workers aren't talking about. Sunbelt Structures is hiring 12 pre-apprentice electricians in Phoenix — no construction experience required.",
    },
  ],
};

function buildPrompt(input: CampaignInput): string {
  return [
    `You are a sharp recruitment-marketing copywriter for the skilled trades.`,
    `Write campaign creative to recruit CAREER-SWITCHERS into becoming ${input.trade}s.`,
    ``,
    `Context:`,
    `- Firm: ${input.firmName}`,
    `- Location: ${input.regionLabel}`,
    `- Shortage: ${input.gapCount} ${input.trade}s needed by ${input.neededByDate}`,
    `- Target audience: people leaving fields like ${input.priorFields.join(", ")} (often displaced by AI/automation)`,
    `- Entry path: paid pre-apprenticeship, OSHA-10 + trade certification, no prior experience required`,
    ``,
    `Tone: confident, respectful, a little bold. NOT cringe, NOT corporate. Speak to dignity and stability.`,
    `Return ONLY JSON matching this shape:`,
    `{"adHeadline": string, "adBody": string, "landing": {"headline": string, "subhead": string, "cta": string, "body": string}, "social": [{"platform": string, "text": string}]}`,
    `Include 3 social posts (Instagram, TikTok, LinkedIn). Keep adBody under 55 words and landing.body under 80 words.`,
  ].join("\n");
}

/**
 * Generate campaign creative. demoMode (or any failure) returns the pre-baked
 * creative so the demo is offline-safe and never breaks live.
 */
export async function generateCampaign(
  input: CampaignInput,
  ctx: AgentContext,
): Promise<CampaignCreative> {
  if (ctx.demoMode) {
    return PREBAKED_CAMPAIGN;
  }
  try {
    const groq = getGroq();
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You output only valid JSON. No prose, no markdown." },
        { role: "user", content: buildPrompt(input) },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = CampaignCreativeSchema.parse(JSON.parse(raw));
    return parsed;
  } catch (err) {
    // Never hard-fail on stage — degrade to the pre-baked creative.
    console.error("[campaign] live generation failed, using fallback:", err);
    return PREBAKED_CAMPAIGN;
  }
}

export const campaignAgent: Agent<CampaignInput, CampaignCreative> = {
  id: "campaign",
  name: "Campaign Agent",
  role: "Generates recruitment creative to convert career-switchers into the short trade.",
  run: generateCampaign,
};
