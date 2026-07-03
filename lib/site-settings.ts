import { sql } from "drizzle-orm";
import { db, rawSql } from "@/db";
import { siteSettings, type NewSiteSettings, type SiteSettings } from "@/db/schema";
import { placeholderProfile } from "@/lib/placeholder-data";
import { normalizeSiteSettingsAssets } from "@/lib/uploads";
import { ensureSiteSettingsTableAndRow } from "@/db/site-settings-bootstrap.mjs";

type SiteSettingsErrorKind =
  | "connection"
  | "tableMissing"
  | "schemaDrift"
  | "permission"
  | "unknown";

export interface SiteSettingsQueryResult {
  settings: SiteSettings | null;
  missingRow: boolean;
  errorKind: SiteSettingsErrorKind | null;
  error: unknown | null;
}

const SITE_SETTINGS_LOCK_KEY = 214748102;

function logSiteSettings(level: "warn" | "error", message: string, error?: unknown) {
  const logger = level === "warn" ? console.warn : console.error;
  if (error) {
    logger(`[site-settings] ${message}`, error);
    return;
  }
  logger(`[site-settings] ${message}`);
}

const EXPECTED_SITE_SETTINGS_COLUMNS = [
  "id", "owner_name", "headline", "bio", "avatar_url", "resume_url",
  "logo_url", "favicon_url", "hero_image_url", "email", "location", "skills",
  "owner_name_fa", "owner_name_en", "headline_fa", "headline_en", "bio_fa",
  "bio_en", "location_fa", "location_en", "skills_fa", "skills_en",
  "about_intro", "about_intro_fa", "about_intro_en", "about_page_content",
  "about_page_content_fa", "about_page_content_en", "contact_page_content",
  "contact_page_content_fa", "contact_page_content_en", "contact_settings",
  "social_links", "created_at", "updated_at",
];

/**
 * Server-only diagnostic snapshot for troubleshooting settings save/load
 * failures. Never exposed to the client — only ever written to server logs.
 * Deliberately tolerant: any failure here is logged and swallowed so a
 * diagnostic query never masks or replaces the original error.
 */
export async function logSiteSettingsDiagnostics(): Promise<void> {
  try {
    const [info] = await db.execute<{ current_database: string; current_schema: string }>(
      sql`select current_database(), current_schema()`,
    );
    const [{ exists: tableExists }] = await db.execute<{ exists: boolean }>(
      sql`select exists (
        select 1 from information_schema.tables
        where table_schema = current_schema() and table_name = 'site_settings'
      ) as exists`,
    );

    let missingColumns: string[] = [];
    let rowCount = 0;
    if (tableExists) {
      const existingColumns = await db.execute<{ column_name: string }>(
        sql`select column_name from information_schema.columns
            where table_schema = current_schema() and table_name = 'site_settings'`,
      );
      const existingSet = new Set(existingColumns.map((c) => c.column_name));
      missingColumns = EXPECTED_SITE_SETTINGS_COLUMNS.filter((c) => !existingSet.has(c));

      const [{ count }] = await db.execute<{ count: string }>(
        sql`select count(*)::text as count from site_settings`,
      );
      rowCount = Number(count);
    }

    logSiteSettings(
      "error",
      `Diagnostics: database=${info?.current_database} schema=${info?.current_schema} ` +
        `tableExists=${tableExists} missingColumns=[${missingColumns.join(", ")}] rowCount=${rowCount}`,
    );
  } catch (diagnosticError) {
    logSiteSettings("error", "Diagnostics query itself failed (likely a real connection issue).", diagnosticError);
  }
}

function stripProfileMeta(profile: typeof placeholderProfile): NewSiteSettings {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = profile;
  void _id;
  void _createdAt;
  void _updatedAt;
  return rest;
}

export function buildDefaultSiteSettings(
  overrides: Partial<NewSiteSettings> = {},
): NewSiteSettings {
  const base = stripProfileMeta(placeholderProfile);
  return {
    ...base,
    ...overrides,
    ownerName: overrides.ownerName ?? base.ownerName,
  };
}

/**
 * Drizzle wraps the raw `postgres` driver error in a `DrizzleQueryError`
 * whose own `.code` is undefined and whose `.message` is just "Failed
 * query: ...". The real Postgres error code/message live on `.cause`. Every
 * classifier below must inspect both, or every drizzle-thrown schema error
 * silently falls through to "unknown" and self-heal never triggers.
 */
function getPostgresErrorInfo(error: unknown): { code?: string; message: string } {
  const cause = (error as { cause?: unknown })?.cause;
  const source = cause && (cause as { code?: string }).code ? cause : error;
  const code = (source as { code?: string })?.code;
  const message = source instanceof Error ? source.message : String(source);
  return { code, message };
}

/** Postgres 42P01: relation does not exist — table/schema was never created. */
export function isSiteSettingsTableMissingError(error: unknown): boolean {
  const { code, message } = getPostgresErrorInfo(error);
  if (code === "42P01") return true;
  return /relation .*site_settings.* does not exist/i.test(message);
}

/** Postgres 42703: column does not exist — table exists but migrations are behind. */
export function isSiteSettingsColumnDriftError(error: unknown): boolean {
  const { code, message } = getPostgresErrorInfo(error);
  if (code === "42703") return true;
  return /column .* does not exist/i.test(message);
}

/** True for either kind of schema problem (missing table or missing column). */
export function isSiteSettingsSchemaError(error: unknown): boolean {
  return isSiteSettingsTableMissingError(error) || isSiteSettingsColumnDriftError(error);
}

/** Postgres 42501: insufficient_privilege — DB user lacks grants on the table. */
export function isSiteSettingsPermissionError(error: unknown): boolean {
  const { code, message } = getPostgresErrorInfo(error);
  if (code === "42501") return true;
  return /permission denied/i.test(message);
}

export function isSiteSettingsConnectionError(error: unknown): boolean {
  const { code, message } = getPostgresErrorInfo(error);
  if (
    typeof code === "string" &&
    ["08000", "08003", "08006", "28P01", "3D000", "ECONNREFUSED", "ENOTFOUND"].includes(code)
  ) {
    return true;
  }

  return /connect|connection|timeout|authentication failed|database .* does not exist|econnrefused|enotfound/i.test(
    message,
  );
}

export function classifySiteSettingsError(error: unknown): SiteSettingsErrorKind {
  // Schema problems first: their Postgres messages can otherwise be caught by
  // the broader connection regex (e.g. "database ... does not exist").
  if (isSiteSettingsTableMissingError(error)) return "tableMissing";
  if (isSiteSettingsColumnDriftError(error)) return "schemaDrift";
  if (isSiteSettingsPermissionError(error)) return "permission";
  if (isSiteSettingsConnectionError(error)) return "connection";
  return "unknown";
}

/**
 * Defensive last resort: if a site_settings operation fails because the
 * table or a column is missing, repair the schema in place via
 * ensureSiteSettingsTableAndRow and retry the operation exactly once. This
 * makes read/save self-healing even if startup bootstrap never ran (e.g. it
 * was disabled, or the deploy predates this fix). Only ever runs server-side
 * with a real DATABASE_URL — never in Edge runtime, never exposing secrets.
 */
async function withSiteSettingsSelfHeal<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!process.env.DATABASE_URL) throw error;
    if (!isSiteSettingsTableMissingError(error) && !isSiteSettingsColumnDriftError(error)) {
      throw error;
    }

    logSiteSettings(
      "warn",
      "Schema error detected. Attempting one-time self-heal via ensureSiteSettingsTableAndRow.",
      error,
    );
    try {
      await ensureSiteSettingsTableAndRow(rawSql);
    } catch (repairError) {
      logSiteSettings("error", "Self-heal attempt failed. Surfacing original error.", repairError);
      throw error;
    }

    logSiteSettings("warn", "Self-heal complete. Retrying the operation once.");
    return await operation();
  }
}

export async function readSiteSettingsRow(): Promise<SiteSettings | null> {
  return withSiteSettingsSelfHeal(async () => {
    const [row] = await db.select().from(siteSettings).limit(1);
    return row ? normalizeSiteSettingsAssets(row) : null;
  });
}

export async function getSiteSettingsQueryResult(): Promise<SiteSettingsQueryResult> {
  try {
    const settings = await readSiteSettingsRow();
    if (!settings) {
      return {
        settings: null,
        missingRow: true,
        errorKind: null,
        error: null,
      };
    }

    return {
      settings,
      missingRow: false,
      errorKind: null,
      error: null,
    };
  } catch (error) {
    const kind = classifySiteSettingsError(error);
    if (kind === "tableMissing") {
      logSiteSettings(
        "error",
        "site_settings table does not exist. Run migrations/db push or enable startup bootstrap.",
        error,
      );
    } else if (kind === "schemaDrift") {
      logSiteSettings(
        "error",
        "site_settings is missing columns. Newer migrations need to be applied.",
        error,
      );
    } else if (kind === "permission") {
      logSiteSettings("error", "Database user lacks permission to read site_settings.", error);
    } else if (kind === "connection") {
      logSiteSettings("error", "Database connection failed while reading site settings.", error);
    } else {
      logSiteSettings("error", "Unexpected error while reading site settings.", error);
    }

    if (kind !== "connection") {
      await logSiteSettingsDiagnostics();
    }

    return {
      settings: null,
      missingRow: false,
      errorKind: kind,
      error,
    };
  }
}

export async function ensureSiteSettings(
  overrides: Partial<NewSiteSettings> = {},
): Promise<SiteSettings> {
  return withSiteSettingsSelfHeal(() =>
    db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(${SITE_SETTINGS_LOCK_KEY})`);

      const [existing] = await tx.select().from(siteSettings).limit(1);
      if (existing) return normalizeSiteSettingsAssets(existing);

      logSiteSettings("warn", "Initializing missing site_settings row.");
      const [created] = await tx
        .insert(siteSettings)
        .values(buildDefaultSiteSettings(overrides))
        .returning();

      return normalizeSiteSettingsAssets(created);
    }),
  );
}

export async function saveSiteSettings(
  values: Omit<NewSiteSettings, "socialLinks">,
): Promise<SiteSettings> {
  return withSiteSettingsSelfHeal(() =>
    db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(${SITE_SETTINGS_LOCK_KEY})`);

      const [existing] = await tx
        .select({ id: siteSettings.id })
        .from(siteSettings)
        .limit(1);

      if (existing) {
        const [updated] = await tx
          .update(siteSettings)
          .set({ ...values, updatedAt: new Date() })
          .where(sql`${siteSettings.id} = ${existing.id}`)
          .returning();

        return normalizeSiteSettingsAssets(updated);
      }

      logSiteSettings("warn", "No site_settings row found during save. Creating one from submitted admin values.");
      const [created] = await tx
        .insert(siteSettings)
        .values(buildDefaultSiteSettings(values))
        .returning();

      return normalizeSiteSettingsAssets(created);
    }),
  );
}
