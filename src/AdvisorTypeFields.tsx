"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import type { AdvisoryType, CourseOption } from "./types";
import { careerTrack, standaloneRoles } from "./roles";
import { needsCourses, needsDepartment } from "./derive";
import { Field, Input, Select } from "./ui";

/**
 * The advisory-role field group — the shared, source-of-truth part of the Invite New Advisor
 * form (Axis 2). Controlled: the parent owns the values. Shows the Career track grouped in the
 * type dropdown, and the role-specific field — Department (Faculty or Department Head) or
 * Courses (Tutor). A Department Head identifies the department they head, and may also serve as
 * that department's Faculty sponsor in the internship approval chain.
 *
 * WIRE: Lynn -> the role/designation, department link, courses, and prefix have no advisor-record
 * field yet; only the derived bookable service (advisory_type_id) persists. See the hubs' work order.
 */
export function AdvisorTypeFields({
  advisoryType,
  onAdvisoryTypeChange,
  prefix,
  onPrefixChange,
  department,
  onDepartmentChange,
  courses,
  onCoursesChange,
  catalog,
  departments,
}: {
  advisoryType: AdvisoryType;
  onAdvisoryTypeChange: (t: AdvisoryType) => void;
  prefix: string;
  onPrefixChange: (p: string) => void;
  department: string;
  onDepartmentChange: (d: string) => void;
  courses: string[];
  onCoursesChange: (c: string[]) => void;
  catalog: CourseOption[];
  departments: string[];
}) {
  return (
    <>
      <Field label="Prefix (optional)">
        <Select value={prefix} onChange={(e) => onPrefixChange(e.target.value)}>
          <option value="">No prefix</option>
          <option value="Dr.">Dr.</option>
        </Select>
      </Field>

      <Field label="Advisor Type">
        <Select
          value={advisoryType}
          onChange={(e) => onAdvisoryTypeChange(e.target.value as AdvisoryType)}
        >
          <optgroup label="Career track">
            {careerTrack.map((r) => (
              <option key={r.type} value={r.type}>
                {r.label}
              </option>
            ))}
          </optgroup>
          {standaloneRoles.map((r) => (
            <option key={r.type} value={r.type}>
              {r.label}
            </option>
          ))}
        </Select>
      </Field>

      {needsDepartment(advisoryType) && (
        <Field
          label={
            advisoryType === "Department Head" ? "Department they head" : "Department"
          }
        >
          <Select value={department} onChange={(e) => onDepartmentChange(e.target.value)}>
            <option value="" disabled>
              Select a department
            </option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </Field>
      )}

      {needsCourses(advisoryType) && (
        <Field label="Courses">
          <CourseMultiSelect
            catalog={catalog}
            selected={courses}
            onChange={onCoursesChange}
          />
        </Field>
      )}
    </>
  );
}

/* Searchable multi-select over the university's course catalog. The catalog is uploaded when
   the university client is set up (WIRE: Lynn). */
function CourseMultiSelect({
  catalog,
  selected,
  onChange,
}: {
  catalog: CourseOption[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog
      .map((c) => c.name)
      .filter((name) => !selected.includes(name))
      .filter((name) => (q ? name.toLowerCase().includes(q) : true));
  }, [catalog, selected, query]);

  return (
    <div>
      {selected.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selected.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-fg"
            >
              {name}
              <button
                type="button"
                onClick={() => onChange(selected.filter((n) => n !== name))}
                className="text-muted hover:text-fg"
                aria-label={`Remove ${name}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-faint" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses…"
          className="pl-8"
        />
      </div>

      <div className="mt-1 max-h-40 overflow-y-auto rounded-lg border border-border-soft">
        {matches.length === 0 ? (
          <p className="px-3 py-2 text-sm text-faint">
            {query ? "No matching courses." : "All courses added."}
          </p>
        ) : (
          matches.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                onChange([...selected, name]);
                setQuery("");
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-muted hover:bg-hover hover:text-fg"
            >
              <Plus className="size-3.5 text-faint" />
              {name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
