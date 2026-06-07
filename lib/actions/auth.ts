"use server";

import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  verifyCredentials,
} from "@/lib/auth";
import { type ActionState, str } from "@/lib/form";
import { getI18n } from "@/lib/i18n/server";

/** Minimal email shape check. */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Log in with email + password. On success, issues a session cookie and
 * redirects to the admin dashboard. On failure, returns an error message.
 */
export async function login(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const { dict } = await getI18n();
  const t = dict.admin.auth;

  const email = str(form, "email");
  const password = str(form, "password");
  const remember = form.get("remember") === "on";

  if (!email || !password) {
    return { error: t.errRequired };
  }
  if (!isValidEmail(email)) {
    return { error: t.errEmail };
  }

  let admin;
  try {
    admin = await verifyCredentials(email, password);
  } catch {
    return { error: t.errDb };
  }

  if (!admin) {
    return { error: t.errInvalid };
  }

  await createSession(admin.id, remember);
  redirect("/admin");
}

/** Log out: destroy the session cookie and return to the login page. */
export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
