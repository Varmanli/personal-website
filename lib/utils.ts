/**
 * Small, dependency-free helpers shared across the app.
 */

/** Join class names, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Safe "first name" for greetings. Returns the first whitespace-delimited
 * token, but falls back to the full name when splitting would be unreliable
 * (single-word names, very short tokens). Works for Persian and English.
 */
export function getDisplayFirstName(ownerName: string): string {
  const trimmed = (ownerName ?? "").trim();
  if (!trimmed) return "";
  const first = trimmed.split(/\s+/)[0];
  // If the first token is too short to be a meaningful name, use the whole name.
  return first.length >= 2 ? first : trimmed;
}

/** Turn a title into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Format a price stored in cents into a currency string. When the price is
 * null (contact-for-quote), returns `quoteLabel` — pass a localized string
 * (e.g. `dict.card.contactQuote`) so no English leaks into Persian views.
 */
export function formatPrice(
  priceCents: number | null | undefined,
  currency = "USD",
  quoteLabel = "Contact for quote",
): string {
  if (priceCents == null) return quoteLabel;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(priceCents / 100);
}

/** Format a date (or date string) for display. */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
