# @steppingstone/advisor-invite

The **one** shared source of truth for the *Invite New Advisor* experience across the
SteppingStone hubs (Advisor Hub + Admin Hub). Extracted so the two hubs can never drift
again — the Advisor Hub's model is canonical.

## What lives here (the drift-prone domain content)

- **Axis 2 — advisor role / designation** (`roles.ts`): `Career · Peer Mentor · Peer Advisor ·
  Academic · Tutor · Faculty · Department Head`, plus the Career-track hierarchy. This is what
  the form's picker offers and what drives the conditional fields.
- **The role-driven field group** (`AdvisorTypeFields`): Faculty / Department Head → **department**,
  Tutor → **courses**, optional **prefix**.
- **Axis 1 derivation** (`derive.ts`): the bookable *service* (`advisory_type_id`) derived from the
  role — `Career/Peer* → Career Services`, `Academic → Academic Advising`, `Tutor → Tutoring`,
  and **Faculty / Department Head → none** (they are internship approvers, not booked).

The two axes are deliberately separate — see the hubs' QA plans. The user only ever picks the
**role**; the bookable service is derived, never chosen.

## What does NOT live here

Each hub keeps its own **Modal / Button** chrome (already identical forks) and its own
`createAdvisor` server action (they differ: Advisor Hub calls it directly with the session org;
Admin Hub is a `formData` action for an explicit university). The package ships only self-contained
`Field/Input/Select` primitives (built on the shared Tailwind tokens) so it renders natively in both.

## Consuming it

`file:` dependency today (both hubs sit beside it in `~/Projects`); a `SteppingStoneDevOps`
git dependency once pushed. Each hub:

1. `package.json` → `"@steppingstone/advisor-invite": "file:../steppingstone-advisor-invite"`
2. `next.config` → `transpilePackages: ["@steppingstone/advisor-invite"]` (shipped as source)
3. `app/globals.css` → `@source "../node_modules/@steppingstone/advisor-invite/src";` so Tailwind
   generates the classes the package uses.

## Backend note (WIRE: Lynn)

The role/designation itself + department link + courses + prefix have **no advisor-record field yet**
(`AdvisorInvite` = email/name/advisory_type/specialty/location). Only the derived `advisory_type_id`
persists today. Faculty/Department Head "no bookable service" also can't be fully honored until the
backend stops defaulting a null `advisory_type_id` to Career Services. See each hub's Lynn work order.
