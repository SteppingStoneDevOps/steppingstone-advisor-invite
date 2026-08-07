import type { AdvisoryRole, AdvisoryType } from "./types";

/**
 * Advisory roles and the Career advising hierarchy — Axis 2, the source of truth for
 * the Invite New Advisor picker across both hubs.
 *
 * The Career track is a chain of authority. Every role in it can take career
 * appointments, but subordinate roles get progressively less access to other
 * platform features (e.g. reporting) once role-based access control is built:
 *
 *     Career Advisor  ->  Peer Mentor  ->  Peer Advisor
 *      (full access)                        (least access)
 *
 * `careerRank` encodes that order — 0 is the top; a higher rank is more subordinate
 * and therefore has LESS access. Non-career roles (Academic, Tutor, Faculty,
 * Department Head) stand alone and have no careerRank.
 *
 * WIRE: Lynn -> this is the single source of truth for the Career track in RBAC.
 * A role must never reach a feature reserved for a role with a LOWER careerRank
 * than its own (e.g. a Peer Advisor cannot access what a Career Advisor can).
 */
export const advisoryRoles: AdvisoryRole[] = [
  { type: "Career", label: "Career Advisor", careerRank: 0 },
  { type: "Peer Mentor", label: "Peer Mentor", careerRank: 1 },
  { type: "Peer Advisor", label: "Peer Advisor", careerRank: 2 },
  { type: "Academic", label: "Academic Advisor" },
  { type: "Tutor", label: "Tutor" },
  { type: "Faculty", label: "Faculty" },
  { type: "Department Head", label: "Department Head" },
];

/** The Career advising track, top-down: Career Advisor -> Peer Mentor -> Peer Advisor. */
export const careerTrack: AdvisoryRole[] = advisoryRoles
  .filter((r) => r.careerRank !== undefined)
  .sort((a, b) => a.careerRank! - b.careerRank!);

/** Roles that aren't part of the Career track. */
export const standaloneRoles: AdvisoryRole[] = advisoryRoles.filter(
  (r) => r.careerRank === undefined,
);

/** True when the role is part of the Career advising track. */
export function isCareerTrack(type: AdvisoryType): boolean {
  return careerTrack.some((r) => r.type === type);
}

/**
 * Employer Insights is a **Career Advisor** capability — the lead of the Career
 * track (careerRank 0). The subordinate Peer Mentor / Peer Advisor roles do NOT
 * get it. (Other advisory types are out of scope for this reporting.)
 * WIRE: Lynn -> enforce in RBAC alongside University Admin access.
 */
export function canAccessEmployerInsights(type: AdvisoryType): boolean {
  return advisoryRoles.find((r) => r.type === type)?.careerRank === 0;
}
