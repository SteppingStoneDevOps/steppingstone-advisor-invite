/** Axis 2 — the advisor's role / designation. This is what the Invite form picks. */
export type AdvisoryType =
  | "Career"
  | "Peer Mentor"
  | "Peer Advisor"
  | "Academic"
  | "Tutor"
  | "Faculty"
  | "Department Head";

export interface AdvisoryRole {
  type: AdvisoryType;
  /** Full display title, e.g. "Career Advisor". */
  label: string;
  /** Position in the Career track (0 = top). Undefined if not in the track. */
  careerRank?: number;
}

/** A course option for the Tutor field's catalog (structurally compatible with each hub's Course). */
export interface CourseOption {
  id: string;
  name: string;
}

/** Everything the role-driven field group collects (Axis 2 + its conditional fields). */
export interface AdvisorTypeValues {
  advisoryType: AdvisoryType;
  prefix: string;
  department: string;
  courses: string[];
}
