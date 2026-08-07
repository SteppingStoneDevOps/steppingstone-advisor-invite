import type { AdvisoryType } from "./types";

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
