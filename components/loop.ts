/** The six-node fleet, shared by the landing loop section, the fleet grid,
 * and the demo run. `io` is the typed input→output contract, shown as data. */
export interface LoopNode {
  id: string;
  n: string;
  name: string;
  role: string;
  io: string;
}

export const LOOP_NODES: LoopNode[] = [
  { id: "intake", n: "01", name: "Intake", role: "Reads the project pipeline", io: "schedule → trade demand" },
  { id: "forecaster", n: "02", name: "Forecaster", role: "Predicts the shortfall", io: "demand vs roster → gap" },
  { id: "campaign", n: "03", name: "Campaign", role: "Recruits career-switchers", io: "gap → ads + landing page" },
  { id: "nurture", n: "04", name: "Nurture", role: "Works the funnel", io: "interest → applications" },
  { id: "screening", n: "05", name: "Screening", role: "Credentials them", io: "applicant → cert path" },
  { id: "dispatch", n: "06", name: "Dispatch", role: "Places them on the job", io: "credentialed → assigned" },
];
