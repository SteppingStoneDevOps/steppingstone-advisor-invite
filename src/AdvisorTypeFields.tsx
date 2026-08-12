"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import type { CourseOption, Designation } from "./types";
import {
  designationLabel,
  isDesignationBookable,
  isValidDesignationSet,
  setIsBookable,
  setNeedsCourses,
  setNeedsDepartment,
} from "./derive";
import { Field, Input, Select } from "./ui";

/**
 * The designation field group — the shared, source-of-truth part of the Invite New Advisor form
 * (2026-08-11 model). Controlled: the parent owns the values. Designations are a SET (checkbox
 * multi-select) whose vocabulary + bookable mapping come from `GET /reference/advisor-designations`
 * (the parent fetches it and passes `designations`). The bookable advisory type is DERIVED by the
 * platform — Faculty wins, a set mapping to nothing is "not bookable" — so we render that from data
 * rather than hard-coding names. Shows the role-specific field: Department (Faculty / Department
 * Head) or Courses (Tutor).
 */
export function AdvisorTypeFields({
  designations,
  selectedIds,
  onSelectedChange,
  prefix,
  onPrefixChange,
  department,
  onDepartmentChange,
  courses,
  onCoursesChange,
  catalog,
  departments,
}: {
  designations: Designation[];
  selectedIds: number[];
  onSelectedChange: (ids: number[]) => void;
  prefix: string;
  onPrefixChange: (p: string) => void;
  department: string;
  onDepartmentChange: (d: string) => void;
  courses: string[];
  onCoursesChange: (c: string[]) => void;
  catalog: CourseOption[];
  departments: string[];
}) {
  const selected = designations.filter((d) => selectedIds.includes(d.id));
  const showDepartment = setNeedsDepartment(selected);
  const showCourses = setNeedsCourses(selected);
  const bookable = setIsBookable(selected);

  function toggle(id: number) {
    if (selectedIds.includes(id)) {
      onSelectedChange(selectedIds.filter((x) => x !== id));
      return;
    }
    // Enforce the co-designation rule up front so an invalid set is never submitted: a single
    // designation, or exactly {Faculty, Department Head}. Adding anything that would break that
    // switches the selection to just the clicked one (single-select with one allowed pairing).
    const nextIds = [...selectedIds, id];
    const next = designations.filter((d) => nextIds.includes(d.id));
    onSelectedChange(isValidDesignationSet(next) ? nextIds : [id]);
  }

  return (
    <>
      <Field label="Prefix (optional)">
        <Select value={prefix} onChange={(e) => onPrefixChange(e.target.value)}>
          <option value="">No prefix</option>
          <option value="Dr.">Dr.</option>
        </Select>
      </Field>

      <Field label="Designations">
        <div className="rounded-lg border border-border bg-transparent p-1">
          {designations.map((d) => (
            <label
              key={d.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm hover:bg-hover"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(d.id)}
                onChange={() => toggle(d.id)}
                className="size-4 accent-indigo"
              />
              <span className="text-fg">{designationLabel(d.name)}</span>
              {!isDesignationBookable(d) && (
                <span className="text-xs text-muted">· not bookable</span>
              )}
            </label>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-muted">
          Pick one designation. Faculty and Department Head are the only two that can be combined.
        </p>
      </Field>

      {selectedIds.length > 0 && !bookable && (
        <p className="-mt-2 mb-1 text-xs text-muted">
          This advisor won&apos;t be bookable for appointments — the selected designations are
          internship-approval roles, not booked services.
        </p>
      )}

      {showDepartment && (
        <Field label="Department">
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

      {showCourses && (
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
