// Public API — the one shared source of truth for Invite New Advisor.
export type {
  AdvisoryType,
  AdvisoryRole,
  CourseOption,
  AdvisorTypeValues,
} from "./types";
export {
  advisoryRoles,
  careerTrack,
  standaloneRoles,
  isCareerTrack,
  canAccessEmployerInsights,
} from "./roles";
export {
  advisoryServiceNameFor,
  isBookable,
  needsDepartment,
  needsCourses,
} from "./derive";
export { AdvisorTypeFields } from "./AdvisorTypeFields";
