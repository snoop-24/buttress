/**
 * Sample construction paperwork for the live paperwork-processing demo.
 * Modeled on real document formats (RFI, AIA G702/G703 pay application, change
 * order, submittal, project schedule). The schedule states crew requirements
 * explicitly so a low-temperature extraction reliably recovers the electrical
 * peak (18) → the 12-electrician gap. Judges can paste their own documents too.
 */

export interface SampleDoc {
  id: string;
  label: string;
  /** What kind of document, for the picker. */
  kind: string;
  text: string;
}

const SCHEDULE = `DESERT RIDGE LOGISTICS CENTER — PROJECT EXECUTION SCHEDULE
Owner: Meridian Industrial Partners   GC: Sunbelt Structures
Location: Phoenix, AZ    Notice to Proceed: 2026-09-14

SCOPE & CREW PLAN (peak concurrent crew by phase)

Phase 1 — Sitework & Foundations (Weeks 0–6)
  Concrete/masonry: 12 · Ironworkers: 8 · Carpenters: 6
Phase 2 — Structural Steel & Framing (Weeks 4–10)
  Ironworkers: 8 · Carpenters: 14
Phase 3 — Electrical Rough-In (Weeks 6–12)
  Electricians: 18 · HVAC: 5
  NOTE: peak electrical manpower — 18 journeymen/apprentices required on site.
Phase 4 — Mechanical / Plumbing (Weeks 8–14)
  Plumbers: 9 · HVAC: 5 · Electricians: 10
Phase 5 — Interior Finishes (Weeks 12–18)
  Carpenters: 10 · Electricians: 6 · Plumbers: 4`;

const RFI = `REQUEST FOR INFORMATION
RFI No.: 142            Project: Desert Ridge Logistics Center
Date: 2026-09-22        Status: Open — response required by 2026-09-26
To: Vantage Architecture (A/E)      From: Sunbelt Structures (GC)
Spec Reference: 26 05 19 · Drawing: E-401, detail 3/E-401

Subject: Electrical feeder routing conflict at gridline C-7

Question: The 480V feeder conduit bank on E-401 conflicts with the storm
drain invert shown on P-201. Please confirm revised routing — over or under
the storm line — and any required derating.

Suggested Resolution: Route feeders above storm drain in dedicated rack;
maintain 12" clearance.

Cost Impact: Potential +$3,400 (added supports). Schedule Impact: 2 days if
resolved after 2026-09-26.`;

const CHANGE_ORDER = `CHANGE ORDER
CO No.: 031        Project: Desert Ridge Logistics Center
Date: 2026-09-24   Originating RFI: 118
Description: Add (2) 25-ton rooftop HVAC units per owner request, Area B.

Cost Breakdown:
  Labor .................. $18,600
  Material ............... $22,400
  Equipment .............. $ 3,900
  Overhead & Profit (15%) $ 3,300
  Change Order Total ..... $48,200

Original Contract Sum ........ $14,880,000
Net Change by Prior COs ...... $   126,500
Contract Sum Prior to this CO  $15,006,500
New Contract Sum ............. $15,054,700
Schedule Impact: +3 calendar days`;

const PAY_APP = `APPLICATION AND CERTIFICATE FOR PAYMENT (AIA G702/G703)
Application No.: 4     Period To: 2026-09-30
Project: Desert Ridge Logistics Center     GC: Sunbelt Structures

1. Original Contract Sum ............... $14,880,000
2. Net change by Change Orders ......... $   174,700
3. Contract Sum to Date ................ $15,054,700
4. Total Completed & Stored to Date .... $ 4,213,300
5. Retainage (5%) ...................... $   210,665
6. Total Earned Less Retainage ......... $ 4,002,635
7. Less Previous Certificates .......... $ 3,120,000
8. CURRENT PAYMENT DUE ................. $   882,635

G703 Continuation (schedule of values, top lines):
  03 30 00 Concrete    sched $2,100,000  compl $2,100,000  100%
  05 12 00 Struct Steel sched $3,400,000 compl $2,890,000   85%
  26 05 00 Electrical  sched $2,650,000  compl $  795,000   30%`;

const SUBMITTAL = `SUBMITTAL LOG
Project: Desert Ridge Logistics Center     GC: Sunbelt Structures
Sub No. | Spec Section | Description | Type | Supplier | Status | Ball-in-court
088 | 26 24 13 | 480V Switchgear | Shop Drawing | Cardinal Electric | Under Review | A/E
091 | 07 42 13 | Metal Wall Panels | Product Data | Rincon Cladding | Approved | GC
093 | 09 91 00 | Paint Color Samples | Sample | ProCoat | Revise & Resubmit | Sub`;

export const SAMPLE_DOCS: SampleDoc[] = [
  { id: "schedule", label: "Project schedule & crew plan", kind: "Schedule", text: SCHEDULE },
  { id: "rfi", label: "RFI-142 · feeder routing conflict", kind: "RFI", text: RFI },
  { id: "co", label: "Change Order 031 · rooftop units", kind: "Change Order", text: CHANGE_ORDER },
  { id: "payapp", label: "Pay App 4 · AIA G702/G703", kind: "Pay Application", text: PAY_APP },
  { id: "submittal", label: "Submittal log", kind: "Submittal", text: SUBMITTAL },
];

/** The default document for the hero run — reliably yields the electrician gap. */
export const DEFAULT_DOC = SCHEDULE;

/** A parsed extraction for one sample document. */
export interface SampleExtraction {
  docType: string;
  autoAction: string;
  title: string;
  summary: string;
  fields: { label: string; value: string }[];
  /** The labor-demand signal this document contributes, shown as the payoff line. */
  signal: string;
}

/**
 * Pre-baked extractions for the auto-playing back-office animation (present mode)
 * — deterministic and offline-safe, so the landing tour never depends on a live
 * API call. Values are read straight off the sample documents above.
 */
export const SAMPLE_EXTRACTIONS: Record<string, SampleExtraction> = {
  schedule: {
    docType: "schedule",
    autoAction: "parsed → demand extracted",
    title: "Desert Ridge — Project Execution Schedule",
    summary: "Five phases with peak concurrent crew by trade. Electrical rough-in peaks at 18.",
    fields: [
      { label: "Peak electricians", value: "18 · wks 6–12" },
      { label: "Location", value: "Phoenix, AZ" },
      { label: "Notice to proceed", value: "2026-09-14" },
    ],
    signal: "→ 12 electricians short · Phoenix · by 2026-10-26",
  },
  rfi: {
    docType: "rfi",
    autoAction: "logged → routed to A/E",
    title: "RFI 142 — Electrical feeder routing conflict",
    summary: "480V feeder conflicts with the storm drain at gridline C-7; response due 2026-09-26.",
    fields: [
      { label: "Spec reference", value: "26 05 19" },
      { label: "Cost impact", value: "+$3,400" },
      { label: "Schedule impact", value: "2 days if late" },
    ],
    signal: "→ electrical scope ramping — crew signal",
  },
  co: {
    docType: "change-order",
    autoAction: "priced → contract updated",
    title: "CO 031 — (2) 25-ton rooftop HVAC units",
    summary: "Owner-added rooftop units in Area B; contract sum and schedule adjusted.",
    fields: [
      { label: "Change order total", value: "$48,200" },
      { label: "New contract sum", value: "$15,054,700" },
      { label: "Schedule impact", value: "+3 days" },
    ],
    signal: "→ added HVAC scope — new labor demand",
  },
  payapp: {
    docType: "pay-app",
    autoAction: "validated → payment certified",
    title: "Pay App 4 — AIA G702/G703",
    summary: "Period to 2026-09-30; progress billed against the schedule of values.",
    fields: [
      { label: "Current payment due", value: "$882,635" },
      { label: "Completed to date", value: "$4.21M" },
      { label: "Electrical complete", value: "30%" },
    ],
    signal: "→ electrical only 30% — crews still needed",
  },
  submittal: {
    docType: "submittal",
    autoAction: "tracked → ball-in-court flagged",
    title: "Submittal Log — 3 items",
    summary: "Switchgear under A/E review; wall panels approved; paint to resubmit.",
    fields: [
      { label: "088 · 480V Switchgear", value: "Under Review" },
      { label: "091 · Wall Panels", value: "Approved" },
      { label: "093 · Paint Samples", value: "Revise" },
    ],
    signal: "→ switchgear pending — electrical path",
  },
};
