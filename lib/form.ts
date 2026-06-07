/**
 * Shared form helpers for admin server actions.
 * Pure functions — safe to import from server action modules.
 */

/** Result returned by admin form server actions (consumed via useActionState). */
export type ActionState = {
  error?: string;
  /** Per-field validation messages, keyed by field name. */
  fieldErrors?: Record<string, string>;
};

/** Empty initial state for useActionState. */
export const initialActionState: ActionState = {};

/** Content status options shared by every content type. */
export const STATUS_OPTIONS = ["draft", "published", "archived"] as const;
export type StatusOption = (typeof STATUS_OPTIONS)[number];

/** Portfolio type/category options. */
export const PORTFOLIO_TYPES = ["commercial", "personal", "freelance"] as const;
export type PortfolioType = (typeof PORTFOLIO_TYPES)[number];

/** Read a trimmed string field; returns undefined when empty. */
export function str(form: FormData, key: string): string | undefined {
  const value = form.get(key);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/** Read a checkbox field as a boolean. */
export function bool(form: FormData, key: string): boolean {
  const value = form.get(key);
  return value === "on" || value === "true";
}

/**
 * Parse a list field. Accepts both comma-separated values and one-per-line
 * input; trims entries and drops empties.
 */
export function list(form: FormData, key: string): string[] {
  const value = form.get(key);
  if (typeof value !== "string") return [];
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

/** Join an array back into newline-separated text for textarea defaults. */
export function linesValue(items?: string[] | null): string {
  return (items ?? []).join("\n");
}

/** Drop case-insensitive duplicates, preserving first occurrence + order. */
export function uniqStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

/** Validate a value against an allowed set, with a fallback default. */
export function oneOf<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

/** Turn a title into a URL-safe slug (mirrors lib/utils slugify). */
export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Parse a price in dollars into integer cents; undefined/empty → null. */
export function parsePriceCents(value: string | undefined): number | null {
  if (!value) return null;
  const dollars = Number(value);
  if (Number.isNaN(dollars) || dollars < 0) return null;
  return Math.round(dollars * 100);
}

/** Format integer cents back into a plain dollars string for form defaults. */
export function centsToDollars(cents: number | null | undefined): string {
  if (cents == null) return "";
  return String(cents / 100);
}
