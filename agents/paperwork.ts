/**
 * Paperwork Intake Agent — the live back-office automation. Given a real
 * construction document (schedule, RFI, change order, pay app, submittal…), it
 * classifies it, extracts the key fields, and states the automated action. For
 * a schedule/scope it also extracts the crew demand — which feeds the
 * deterministic forecaster to derive the labor gap.
 *
 * The extraction is genuinely live (Groq). demoMode / any failure falls back to
 * a hand-built parse of the sample schedule so the hero run can't break.
 */

import { z } from "zod";
import type { AgentContext } from "@/agents/types";
import type { Project, Trade } from "@/lib/domain";

const DemandSchema = z.object({
  projectName: z.string(),
  startDate: z.string(),
  phases: z
    .array(
      z.object({
        name: z.string(),
        startWeek: z.number(),
        endWeek: z.number(),
        crew: z.record(z.string(), z.number()),
      }),
    )
    .min(1),
});

export const ProcessedDocSchema = z.object({
  docType: z.string(),
  title: z.string(),
  summary: z.string(),
  fields: z.array(z.object({ label: z.string(), value: z.string() })).max(8),
  autoAction: z.string(),
  demand: DemandSchema.nullable().optional(),
});

export type ProcessedDoc = z.infer<typeof ProcessedDocSchema>;

const TRADE_SET: Record<string, Trade> = {
  electrician: "electrician",
  electricians: "electrician",
  electrical: "electrician",
  plumber: "plumber",
  plumbers: "plumber",
  plumbing: "plumber",
  carpenter: "carpenter",
  carpenters: "carpenter",
  carpentry: "carpenter",
  framing: "carpenter",
  hvac: "hvac",
  mechanical: "hvac",
  ironworker: "ironworker",
  ironworkers: "ironworker",
  steel: "ironworker",
  iron: "ironworker",
  concrete: "concrete",
  masonry: "concrete",
  mason: "concrete",
};

function normalizeTrade(raw: string): Trade | null {
  return TRADE_SET[raw.trim().toLowerCase()] ?? null;
}

/** Hand-built fallback parse of the sample schedule — yields the 12-electrician gap. */
export const PREBAKED_SCHEDULE: ProcessedDoc = {
  docType: "schedule",
  title: "Desert Ridge Logistics Center — Execution Schedule",
  summary: "5-phase crew plan; electrical rough-in is the manpower peak.",
  fields: [
    { label: "Owner", value: "Meridian Industrial Partners" },
    { label: "Location", value: "Phoenix, AZ" },
    { label: "Notice to Proceed", value: "2026-09-14" },
    { label: "Phases", value: "5" },
    { label: "Peak trade", value: "Electricians — 18 (wk 6–12)" },
  ],
  autoAction: "parsed → demand extracted",
  demand: {
    projectName: "Desert Ridge Logistics Center",
    startDate: "2026-09-14",
    phases: [
      { name: "Sitework & Foundations", startWeek: 0, endWeek: 6, crew: { concrete: 12, ironworker: 8, carpenter: 6 } },
      { name: "Structural Steel & Framing", startWeek: 4, endWeek: 10, crew: { ironworker: 8, carpenter: 14 } },
      { name: "Electrical Rough-In", startWeek: 6, endWeek: 12, crew: { electrician: 18, hvac: 5 } },
      { name: "Mechanical / Plumbing", startWeek: 8, endWeek: 14, crew: { plumber: 9, hvac: 5, electrician: 10 } },
      { name: "Interior Finishes", startWeek: 12, endWeek: 18, crew: { carpenter: 10, electrician: 6, plumber: 4 } },
    ],
  },
};

function buildPrompt(doc: string): string {
  return [
    "You process construction back-office paperwork. Classify the document and extract it.",
    "",
    "Return ONLY JSON:",
    '{"docType": one of "schedule"|"rfi"|"change-order"|"pay-app"|"submittal"|"payroll"|"daily-report"|"other",',
    ' "title": string, "summary": one sentence, "fields": [{"label": string, "value": string}] (3-6 key fields),',
    ' "autoAction": short verb phrase for what an automation did (e.g. schedule→"parsed → demand extracted",',
    '   rfi→"auto-answered", change-order→"priced & drafted", pay-app→"assembled", submittal→"logged", payroll→"filed"),',
    ' "demand": null, OR — ONLY if the document states crew/manpower counts by phase —',
    '   {"projectName": string, "startDate": ISO date, "phases": [{"name": string, "startWeek": number, "endWeek": number,',
    '     "crew": { trade: peak_headcount }}]}.',
    "For crew trade keys use ONLY: electrician, plumber, carpenter, hvac, ironworker, concrete",
    "(map synonyms: electrical→electrician, mechanical→hvac, steel/iron→ironworker, masonry→concrete).",
    "",
    "DOCUMENT:",
    doc,
  ].join("\n");
}

export async function processDocument(doc: string, ctx: AgentContext): Promise<ProcessedDoc> {
  if (ctx.demoMode) return PREBAKED_SCHEDULE;
  try {
    const { getGroq, GROQ_MODEL } = await import("@/lib/groq");
    const groq = getGroq();
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You output only valid JSON. No prose, no markdown." },
        { role: "user", content: buildPrompt(doc) },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = ProcessedDocSchema.parse(JSON.parse(raw));
    // Normalize demand trades to our keys; drop anything unrecognized.
    if (parsed.demand) {
      parsed.demand.phases = parsed.demand.phases.map((p) => {
        const crew: Record<string, number> = {};
        for (const [k, v] of Object.entries(p.crew)) {
          const t = normalizeTrade(k);
          if (t && Number.isFinite(v) && v > 0) crew[t] = Math.max(crew[t] ?? 0, v);
        }
        return { ...p, crew };
      });
    }
    return parsed;
  } catch (err) {
    console.error("[paperwork] live extraction failed, using fallback:", err);
    return PREBAKED_SCHEDULE;
  }
}

/** Build a Project from an extracted demand, for the deterministic forecaster. */
export function demandToProject(
  demand: NonNullable<ProcessedDoc["demand"]>,
  firmId: string,
  region: { city: string; state: string },
): Project {
  return {
    id: "proj-extracted",
    name: demand.projectName,
    firmId,
    region,
    startDate: demand.startDate,
    phases: demand.phases.map((p, i) => ({
      id: `ph-${i}`,
      name: p.name,
      startWeek: p.startWeek,
      endWeek: p.endWeek,
      crew: p.crew as Partial<Record<Trade, number>>,
    })),
  };
}
