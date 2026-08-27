/**
 * POST /api/campaign — runs the Campaign agent server-side so GROQ_API_KEY
 * never reaches the browser. Body is a CampaignInput plus an optional
 * `demoMode` flag; returns the generated (or pre-baked) creative as JSON.
 */

import { NextResponse } from "next/server";
import { generateCampaign, PREBAKED_CAMPAIGN, type CampaignInput } from "@/agents/campaign";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  let body: (CampaignInput & { demoMode?: boolean }) | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  if (!body || !body.trade) {
    return NextResponse.json({ error: "missing campaign input" }, { status: 400 });
  }

  try {
    const creative = await generateCampaign(body, { demoMode: Boolean(body.demoMode) });
    return NextResponse.json(creative);
  } catch (err) {
    // generateCampaign already falls back internally; this is a last resort.
    console.error("[api/campaign] unexpected error:", err);
    return NextResponse.json(PREBAKED_CAMPAIGN);
  }
}
