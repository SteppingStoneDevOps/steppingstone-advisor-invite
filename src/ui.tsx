import { cloneElement, isValidElement, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./cn";

/**
 * Self-contained form primitives, matched to the hubs' `components/ui/form` so the package
 * renders natively. They use the shared SteppingStone Tailwind tokens (fg / muted / faint /
 * border / control / bg / brand), which BOTH hubs define — the consuming app just needs to
 * `@source` this package so the classes are generated.
 */
export const fieldBase =
  "w-full rounded-lg border border-control bg-bg/60 px-3 text-sm text-fg placeholder:text-faint focus:border-brand/70 focus:outline-hidden focus:ring-1 focus:ring-brand/40";

export const labelBase = "mb-1.5 block text-xs font-medium text-muted";

export function Label({
  children,
  className,
  htmlFor,
}: {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn(labelBase, className)}>
      {children}
    </label>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, "h-9", className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(fieldBase, "h-9 appearance-none pr-9", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </div>
  );
}

type ControlProps = { id?: string };

/**
 * Label + control. When the child is a single element (Input, Select or a raw control) the label
 * is wired to it with a generated id (WCAG 1.3.1 / 4.1.2), matching hub-kit's `Field`. A child
 * that carries its own `id` keeps it; a fragment or multiple children render unchanged (no
 * wiring). A group of controls (checkboxes) belongs in a `<fieldset>` + `<legend>`, not a Field.
 */
export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const uid = useId();

  let control = children;
  let controlId: string | undefined;
  if (isValidElement<ControlProps>(children)) {
    controlId = children.props.id ?? uid;
    control = cloneElement(children, { id: controlId });
  }

  return (
    <div className="mb-4">
      <Label htmlFor={controlId}>{label}</Label>
      {control}
    </div>
  );
}
