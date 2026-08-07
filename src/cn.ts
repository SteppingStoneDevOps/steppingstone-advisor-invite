/** Tiny className joiner — no external deps. Our usages don't produce conflicting utilities. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
