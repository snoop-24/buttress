/**
 * Nurture Agent — light generative touch. Writes one outreach message that
 * moves an interested lead toward applying. Same discipline as Campaign:
 * demoMode or any error degrades to a hand-written message. The run keeps
 * Campaign as the live hero and defaults Nurture to pre-baked to limit the
 * on-stage network surface — but the live path exists and is configurable.
 */

import { z } from "zod";
import type { Agent, AgentContext } from "@/agents/types";
import type { Trade } from "@/lib/domain";

export const NurtureMessageSchema = z.object({
  channel: z.enum(["SMS", "Email"]),
  subject: z.string().optional(),
  body: z.string(),
});

export type NurtureMessage = z.infer<typeof NurtureMessageSchema>;

export interface NurtureInput {
  trade: Trade;
  regionLabel: string;
  firmName: string;
  /** Credential program name, e.g. "Electrical Pre-Apprenticeship". */
  pathName: string;
  weeks: number;
}

export const PREBAKED_NURTURE: NurtureMessage = {
  channel: "SMS",
  body:
    "Hey — you asked about the Phoenix electrician pre-apprenticeship. It's paid, 8 weeks, no experience needed, and there are 12 spots on a real job starting Oct 26. Want me to check if you qualify? Takes 2 minutes. — Sunbelt Structures",
};

function buildPrompt(input: NurtureInput): string {
  return [
    `Write ONE short, warm outreach message (SMS) to a career-switcher who showed interest in becoming a ${input.trade} via ${input.firmName} in ${input.regionLabel}.`,
    `Program: ${input.pathName}, paid, ${input.weeks} weeks, no experience required.`,
    `Goal: get them to reply and start qualifying. Human, not salesy. Under 45 words.`,
    `Return ONLY JSON: {"channel": "SMS", "body": string}.`,
  ].join("\n");
}

export async function generateNurture(
  input: NurtureInput,
  ctx: AgentContext,
): Promise<NurtureMessage> {
  if (ctx.demoMode) {
    return PREBAKED_NURTURE;
  }
  try {
    const { getGroq, GROQ_MODEL } = await import("@/lib/groq");
    const groq = getGroq();
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You output only valid JSON. No prose, no markdown." },
        { role: "user", content: buildPrompt(input) },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    return NurtureMessageSchema.parse(JSON.parse(raw));
  } catch (err) {
    console.error("[nurture] live generation failed, using fallback:", err);
    return PREBAKED_NURTURE;
  }
}

export const nurtureAgent: Agent<NurtureInput, NurtureMessage> = {
  id: "nurture",
  name: "Nurture Agent",
  role: "Runs the funnel: turns interest into applications with targeted outreach.",
  run: generateNurture,
};
