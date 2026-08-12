import type { AdvisoryType, Designation } from "./types";

/**
 * Axis 1 (bookable service) derived from Axis 2 (role). The user never picks the service —
 * it follows from the role. The strings match the platform's `/reference/advisory-types`
 * `name`s exactly, so the caller can map straight to an `advisory_type_id`.
 *
 * Faculty and Department Head are internship approvers, NOT people a student books — so they
 * have **no bookable service** (null). NOTE: the platform currently defaults a null
 * `advisory_type_id` to Career Services, so honoring "no service" for these two needs the
 * designation model on the advisor record (see the hubs' Lynn work order).
 */
const ROLE_TO_SERVICE: Record<AdvisoryType, string | null> = {
  Career: "Career Services",
  "Peer Mentor": "Career Services",
  "Peer Advisor": "Career Services",
  Academic: "Academic Advising",
  Tutor: "Tutoring",
  Faculty: null,
  "Department Head": null,
};

/** The `/reference/advisory-types` name this role books, or null when the role isn't bookable. */
export function advisoryServiceNameFor(role: AdvisoryType): string | null {
  return ROLE_TO_SERVICE[role] ?? null;
}

/** False for Faculty / Department Head (internship approvers, not booked). */
export function isBookable(role: AdvisoryType): boolean {
  return advisoryServiceNameFor(role) !== null;
}

/** True when the role surfaces the Department field (Faculty or Department Head). */
export function needsDepartment(role: AdvisoryType): boolean {
  return role === "Faculty" || role === "Department Head";
}

/** True when the role surfaces the Courses field (Tutor). */
export function needsCourses(role: AdvisoryType): boolean {
  return role === "Tutor";
}

/* ─── Designation model (2026-08-11): the write path, driven by reference data ─────────── */

/** Humanize a designation's backend name: "DepartmentHead" → "Department Head". */
export function designationLabel(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, "$1 $2");
}

/**
 * A designation confers a bookable service iff its advisory type is non-null. ⚠️ Career is 0
 * (falsy) yet bookable — compare against null, never truthiness.
 */
export function isDesignationBookable(d: Designation): boolean {
  return d.advisoryTypeId != null;
}

/** True when a designation surfaces the Department field (Faculty or Department Head). */
export function designationNeedsDepartment(name: string): boolean {
  return name === "Faculty" || name === "DepartmentHead";
}

/** True when a designation surfaces the Courses field (Tutor). */
export function designationNeedsCourses(name: string): boolean {
  return name === "Tutor";
}

/** The selected set surfaces the Department field if any selected designation needs it. */
export function setNeedsDepartment(selected: Designation[]): boolean {
  return selected.some((d) => designationNeedsDepartment(d.name));
}

/** The selected set surfaces the Courses field if any selected designation needs it. */
export function setNeedsCourses(selected: Designation[]): boolean {
  return selected.some((d) => designationNeedsCourses(d.name));
}

/** The advisor is bookable iff at least one selected designation confers a service. */
export function setIsBookable(selected: Designation[]): boolean {
  return selected.some(isDesignationBookable);
}
