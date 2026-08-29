/**
 * POST /api/paperwork — runs the Paperwork Intake agent server-side (keeps
 * GROQ_API_KEY off the client). Body: { document: string, demoMode?: boolean }.
 * Returns a ProcessedDoc (classification, extracted fields, auto-action, and
 * crew demand for schedules).
 */

import { NextResponse } from "next/server";
import { processDocument, PREBAKED_SCHEDULE } from "@/agents/paperwork";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  let body: { document?: string; demoMode?: boolean } | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const document = body?.document?.trim();
  if (!document) {
    return NextResponse.json({ error: "missing document" }, { status: 400 });
  }
  try {
    const result = await processDocument(document, { demoMode: Boolean(body?.demoMode) });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/paperwork] unexpected error:", err);
    return NextResponse.json(PREBAKED_SCHEDULE);
  }
}
