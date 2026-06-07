"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LOCALE_COOKIE, toLocale } from "@/lib/i18n/config";

/**
 * Persist the visitor's language choice in a cookie and refresh the UI.
 * Called from the client language switcher.
 */
export async function setLocale(value: string): Promise<void> {
  const locale = toLocale(value);
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  // Re-render all layouts/pages so text + direction update everywhere.
  revalidatePath("/", "layout");
}
