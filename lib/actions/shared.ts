import type { ActionState } from "@/lib/form";
import { getI18n } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** Resolve the locale-appropriate admin error messages. */
export async function getAdminErrors(): Promise<Dictionary["admin"]["errors"]> {
  const { dict } = await getI18n();
  return dict.admin.errors;
}

/**
 * Map a thrown DB/runtime error into a friendly ActionState.
 * Used by every admin write action so failures never look like successes.
 */
export function toActionError(
  error: unknown,
  errs: Dictionary["admin"]["errors"],
): ActionState {
  const message = error instanceof Error ? error.message : String(error);

  // Unique constraint (e.g. slug already taken) — Postgres code 23505.
  if (
    message.includes("duplicate key") ||
    (typeof (error as { code?: string })?.code === "string" &&
      (error as { code?: string }).code === "23505")
  ) {
    return { error: errs.slugTaken };
  }

  // Connection failures — surface clearly rather than faking success.
  return { error: errs.db };
}
