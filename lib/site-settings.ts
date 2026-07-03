import { sql } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings, type NewSiteSettings, type SiteSettings } from "@/db/schema";
import { placeholderProfile } from "@/lib/placeholder-data";
import { normalizeSiteSettingsAssets } from "@/lib/uploads";

type SiteSettingsErrorKind = "connection" | "schema" | "unknown";

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

export function isSiteSettingsSchemaError(error: unknown): boolean {
  const code = (error as { code?: string })?.code;
  if (code === "42P01" || code === "42703") return true;
  const message = error instanceof Error ? error.message : String(error);
  return /does not exist|relation .*site_settings.* does not exist/i.test(message);
}

export function isSiteSettingsConnectionError(error: unknown): boolean {
  const code = (error as { code?: string })?.code;
  if (typeof code === "string" && ["28P01", "3D000", "ECONNREFUSED", "ENOTFOUND"].includes(code)) {
    return true;
  }

  const message = error instanceof Error ? error.message : String(error);
  return /connect|connection|timeout|authentication failed|database .* does not exist|econnrefused|enotfound/i.test(
    message,
  );
}

export function classifySiteSettingsError(error: unknown): SiteSettingsErrorKind {
  if (isSiteSettingsSchemaError(error)) return "schema";
  if (isSiteSettingsConnectionError(error)) return "connection";
  return "unknown";
}

export async function readSiteSettingsRow(): Promise<SiteSettings | null> {
  const [row] = await db.select().from(siteSettings).limit(1);
  return row ? normalizeSiteSettingsAssets(row) : null;
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
    if (kind === "schema") {
      logSiteSettings("error", "site_settings table/schema is missing. Run migrations or db:push.", error);
    } else if (kind === "connection") {
      logSiteSettings("error", "Database connection failed while reading site settings.", error);
    } else {
      logSiteSettings("error", "Unexpected error while reading site settings.", error);
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
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(${SITE_SETTINGS_LOCK_KEY})`);

    const [existing] = await tx.select().from(siteSettings).limit(1);
    if (existing) return normalizeSiteSettingsAssets(existing);

    logSiteSettings("warn", "Initializing missing site_settings row.");
    const [created] = await tx
      .insert(siteSettings)
      .values(buildDefaultSiteSettings(overrides))
      .returning();

    return normalizeSiteSettingsAssets(created);
  });
}

export async function saveSiteSettings(
  values: Omit<NewSiteSettings, "socialLinks">,
): Promise<SiteSettings> {
  return db.transaction(async (tx) => {
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
  });
}
