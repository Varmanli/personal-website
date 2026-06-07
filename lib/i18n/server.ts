import { cookies } from "next/headers";
import { LOCALE_COOKIE, toLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

/** Read the visitor's locale from the cookie (server components/actions). */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return toLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}

/** Get locale + dictionary together for a server component. */
export async function getI18n(): Promise<{
  locale: Locale;
  dict: Dictionary;
}> {
  const locale = await getLocale();
  return { locale, dict: getDictionary(locale) };
}
