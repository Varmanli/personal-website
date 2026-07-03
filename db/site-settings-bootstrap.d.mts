import type postgres from "postgres";

/**
 * Ensures the `site_settings` table exists with the full current schema and
 * has at least one row. Safe to call repeatedly (idempotent, additive only).
 */
export function ensureSiteSettingsTableAndRow(
  sql: postgres.Sql,
): Promise<void>;
