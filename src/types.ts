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

/**
 * A designation from `GET /reference/advisor-designations` (the 2026-08-11 model). WHAT the
 * advisor IS, selected as a SET; the bookable advisory type is DERIVED from it (Faculty wins,
 * a set mapping to nothing is "not bookable").
 */
export interface Designation {
  /** `advisor_designation_id` — the int carried in `designation_ids`. */
  id: number;
  /** Raw backend name, e.g. "Career", "DepartmentHead", "PeerMentor". */
  name: string;
  /**
   * The bookable advisory type this designation confers, or `null` when it confers none
   * ("not bookable"). ⚠️ CAREER MAPS TO 0 — always compare against `null`, never truthiness
   * (0 is falsy), or a Career advisor reads as not bookable.
   */
  advisoryTypeId: number | null;
}

/** Everything the designation field group collects (the write path). */
export interface DesignationValues {
  designationIds: number[];
  prefix: string;
  department: string;
  courses: string[];
}
