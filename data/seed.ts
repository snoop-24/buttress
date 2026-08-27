/**
 * Seeded demo data. One firm, one project, one candidate pool.
 *
 * The numbers here are chosen so the deterministic Forecaster derives the
 * hero-demo gap ("12 electricians short in Phoenix, in ~6 weeks") with no
 * randomness. Everything is static so the live run is reproducible.
 */

import type { Candidate, Firm, Project } from "@/lib/domain";

export const PHOENIX = { city: "Phoenix", state: "AZ" } as const;

/** Mid-size Phoenix general contractor — the demo firm. */
export const DEMO_FIRM: Firm = {
  id: "firm-sunbelt",
  name: "Sunbelt Structures",
  region: PHOENIX,
  roster: [
    { trade: "electrician", count: 6 },
    { trade: "plumber", count: 9 },
    { trade: "carpenter", count: 14 },
    { trade: "hvac", count: 5 },
    { trade: "ironworker", count: 8 },
    { trade: "concrete", count: 12 },
  ],
};

/**
 * A new commercial project. Its electrical rough-in phase peaks at 18
 * electricians for six weeks starting in week 6 — against a roster of 6,
 * that is the 12-electrician gap the demo is built around.
 */
export const DEMO_PROJECT: Project = {
  id: "proj-desert-ridge",
  name: "Desert Ridge Logistics Center",
  firmId: DEMO_FIRM.id,
  region: PHOENIX,
  startDate: "2026-09-14", // week 0
  phases: [
    {
      id: "ph-sitework",
      name: "Sitework & Foundations",
      startWeek: 0,
      endWeek: 6,
      crew: { concrete: 12, ironworker: 8, carpenter: 6 },
    },
    {
      id: "ph-structure",
      name: "Structural Steel & Framing",
      startWeek: 4,
      endWeek: 10,
      crew: { ironworker: 8, carpenter: 14 },
    },
    {
      id: "ph-electrical-rough",
      name: "Electrical Rough-In",
      startWeek: 6,
      endWeek: 12,
      crew: { electrician: 18, hvac: 5 },
    },
    {
      id: "ph-mep",
      name: "Mechanical / Plumbing",
      startWeek: 8,
      endWeek: 14,
      crew: { plumber: 9, hvac: 5, electrician: 10 },
    },
    {
      id: "ph-finishes",
      name: "Interior Finishes",
      startWeek: 12,
      endWeek: 18,
      crew: { carpenter: 10, electrician: 6, plumber: 4 },
    },
  ],
};

// --- Simulated candidate pool -------------------------------------------
// Career-switchers targeting the electrician shortage. Generated
// deterministically (no Math.random) from fixed lists so the pool is
// identical on every run.

const FIRST_NAMES = [
  "Marcus", "Diana", "Andre", "Priya", "Luis", "Kayla", "Trevor", "Nia",
  "Sam", "Rosa", "Devin", "Amara", "Cole", "Yuki", "Bryce", "Tanya",
  "Omar", "Jade", "Nathan", "Sofia", "Isaac", "Bianca", "Reid", "Mei",
  "Darius", "Elena", "Grant", "Layla", "Victor", "Hana", "Kevin", "Zoe",
];

const LAST_NAMES = [
  "Ellison", "Park", "Okafor", "Nguyen", "Ramirez", "Bauer", "Cho", "Silva",
  "Foster", "Delgado", "Ward", "Haddad", "Reyes", "Tanaka", "Novak", "Blake",
];

/** Prior fields chosen to tell the 2026 "AI displaces white-collar" story. */
const PRIOR_FIELDS = [
  "Retail associate",
  "Warehouse / logistics",
  "Rideshare driver",
  "Call-center support",
  "Junior data analyst",
  "Bank teller",
  "Line cook",
  "Delivery driver",
  "Bookkeeping clerk",
  "Customer success rep",
  "Copywriter",
  "Front-desk / admin",
];

/**
 * Build a stable pool of `n` simulated electrician candidates. All start
 * as `lead`; the funnel engine advances them during the run.
 */
export function buildCandidatePool(n = 30): Candidate[] {
  const pool: Candidate[] = [];
  for (let i = 0; i < n; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    pool.push({
      id: `cand-${String(i + 1).padStart(3, "0")}`,
      name: `${first} ${last}`,
      priorField: PRIOR_FIELDS[i % PRIOR_FIELDS.length],
      targetTrade: "electrician",
      stage: "lead",
      simulated: true,
    });
  }
  return pool;
}

export const DEMO_CANDIDATES: Candidate[] = buildCandidatePool(30);
