import type { ActionState } from "@/lib/form";
import { getI18n } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import {
  isSiteSettingsConnectionError,
  isSiteSettingsPermissionError,
  isSiteSettingsTableMissingError,
  isSiteSettingsColumnDriftError,
  logSiteSettingsDiagnostics,
} from "@/lib/site-settings";

/** Resolve the locale-appropriate admin error messages. */
export async function getAdminErrors(): Promise<Dictionary["admin"]["errors"]> {
  const { dict } = await getI18n();
  return dict.admin.errors;
}

/**
 * Map a thrown DB/runtime error into a friendly ActionState.
 *
 * Every branch here is checked and ordered deliberately: schema/permission
 * errors must be classified before the connection check, since Postgres
 * messages for missing tables/columns can otherwise be mistaken for
 * connection failures (e.g. "database ... does not exist"). Anything that
 * doesn't match a known Postgres error code is logged in full and reported
 * as a generic save error — it must NOT be reported as a connection failure,
 * since that hides the real cause and misleads whoever is debugging it.
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

  if (isSiteSettingsTableMissingError(error)) {
    console.error("[admin-action] Table missing while saving:", error);
    void logSiteSettingsDiagnostics();
    return { error: errs.tableMissing };
  }

  if (isSiteSettingsColumnDriftError(error)) {
    console.error("[admin-action] Column drift while saving:", error);
    void logSiteSettingsDiagnostics();
    return { error: errs.schemaDrift };
  }

  if (isSiteSettingsPermissionError(error)) {
    console.error("[admin-action] Permission denied while saving:", error);
    void logSiteSettingsDiagnostics();
    return { error: errs.permission };
  }

  if (isSiteSettingsConnectionError(error)) {
    console.error("[admin-action] Database connection failed while saving:", error);
    return { error: errs.db };
  }

  // Unknown cause — log the full error so it's traceable, but don't claim a
  // connection failure when we don't actually know that's what happened.
  console.error("[admin-action] Unclassified error while saving:", error);
  void logSiteSettingsDiagnostics();
  return { error: errs.unknown };
}
