/** Supported locales. Admin UI stays English regardless of this setting. */
export const locales = ["en", "fa"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fa";

/** Cookie that stores the visitor's language preference. */
export const LOCALE_COOKIE = "lang";

/** Text direction for a locale. */
export function dirFor(locale: Locale): "ltr" | "rtl" {
  return locale === "fa" ? "rtl" : "ltr";
}

/** Narrow an arbitrary string to a supported Locale (falls back to default). */
export function toLocale(value: string | undefined | null): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : defaultLocale;
}
