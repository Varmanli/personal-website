import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  projects,
  services,
  contactMessages,
  siteSettings,
} from "@/db/schema";
import type {
  Project,
  Service,
  ContactMessage,
  SiteSettings,
} from "@/types";
import {
  placeholderProjects,
  placeholderServices,
  placeholderMessages,
  placeholderProfile,
} from "@/lib/placeholder-data";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import {
  localizeProject,
  localizeService,
  localizeProfile,
  type LocalizedProject,
} from "@/lib/i18n/localize";
import {
  getFallbackAboutPageContent,
  normalizeAboutPageContent,
} from "@/lib/about-page";
import {
  getFallbackContactPageContent,
  normalizeContactPageContent,
} from "@/lib/contact-page";
import { normalizeSiteSettingsAssets } from "@/lib/uploads";
import type { AboutPageContent, ContactPageContent } from "@/types";

/**
 * Data-access layer.
 *
 * Every public/admin page and the public API routes read through these
 * functions instead of touching `db` or `placeholder-data` directly.
 *
 * Behaviour:
 *  - DB reachable      → returns real rows (an empty table returns []).
 *  - DB unreachable    → falls back to placeholder data so local dev and
 *                        `next build` work without a running Postgres.
 *
 * This means an *empty* database renders real empty states, while a *missing*
 * database renders the placeholder content. Replace/remove the fallbacks once
 * a database is always present in your environments.
 */

let warned = false;
function warnOnce(scope: string, error: unknown) {
  if (warned) return;
  warned = true;
  const message = error instanceof Error ? error.message : String(error);
  console.warn(
    `[data] Database unavailable (${scope}: ${message}). Falling back to placeholder content. ` +
      `Set DATABASE_URL and run \`npm run db:push && npm run db:seed\` to use real data.`,
  );
}

/** Run a DB query, falling back to placeholder content on connection errors. */
async function query<T>(
  scope: string,
  run: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await run();
  } catch (error) {
    warnOnce(scope, error);
    return fallback;
  }
}

/* ----------------------------------- Projects ---------------------------------- */

/** All published projects, featured first, newest first — localized. */
export async function getPublishedProjects(
  locale: Locale = defaultLocale,
): Promise<LocalizedProject[]> {
  const rows = await query(
    "projects",
    () =>
      db
        .select()
        .from(projects)
        .where(eq(projects.status, "published"))
        .orderBy(desc(projects.isFeatured), desc(projects.createdAt)),
    placeholderProjects,
  );
  return rows.map((p) => localizeProject(p, locale));
}

/** Featured published projects, limited for previews (e.g. the home page). */
export async function getFeaturedProjects(
  limit = 3,
  locale: Locale = defaultLocale,
): Promise<LocalizedProject[]> {
  const rows = await query(
    "projects",
    () =>
      db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.status, "published"),
            eq(projects.isFeaturedOnHome, true),
          ),
        )
        .orderBy(asc(projects.homeOrder), desc(projects.createdAt)),
    placeholderProjects
      .filter((p) => p.isFeaturedOnHome)
      .sort((a, b) => {
        const orderDiff = a.homeOrder - b.homeOrder;
        if (orderDiff !== 0) return orderDiff;
        return b.createdAt.getTime() - a.createdAt.getTime();
      }),
  );
  return rows.slice(0, limit).map((p) => localizeProject(p, locale));
}

/** A single published project by slug, or null when not found — localized. */
export async function getProjectBySlug(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<LocalizedProject | null> {
  const row = await query(
    "projects",
    async () => {
      const [r] = await db
        .select()
        .from(projects)
        .where(eq(projects.slug, slug))
        .limit(1);
      return r ?? null;
    },
    placeholderProjects.find((p) => p.slug === slug) ?? null,
  );
  return row ? localizeProject(row, locale) : null;
}

/** All projects regardless of status (admin). */
export function getAllProjects(): Promise<Project[]> {
  return query(
    "projects",
    () => db.select().from(projects).orderBy(desc(projects.createdAt)),
    placeholderProjects,
  );
}

/** A single project by id, or null when not found (admin edit). */
export function getProjectById(id: number): Promise<Project | null> {
  return query(
    "projects",
    async () => {
      const [row] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);
      return row ?? null;
    },
    placeholderProjects.find((p) => p.id === id) ?? null,
  );
}

/* ----------------------------------- Services ---------------------------------- */

/** All published services, featured first — localized. */
export async function getPublishedServices(
  locale: Locale = defaultLocale,
): Promise<Service[]> {
  const rows = await query(
    "services",
    () =>
      db
        .select()
        .from(services)
        .where(eq(services.status, "published"))
        .orderBy(desc(services.isFeatured), services.priceCents),
    placeholderServices,
  );
  return rows.map((s) => localizeService(s, locale));
}

/** All services regardless of status (admin). */
export function getAllServices(): Promise<Service[]> {
  return query(
    "services",
    () => db.select().from(services).orderBy(desc(services.createdAt)),
    placeholderServices,
  );
}

/** A single service by id, or null when not found (admin edit). */
export function getServiceById(id: number): Promise<Service | null> {
  return query(
    "services",
    async () => {
      const [row] = await db
        .select()
        .from(services)
        .where(eq(services.id, id))
        .limit(1);
      return row ?? null;
    },
    placeholderServices.find((s) => s.id === id) ?? null,
  );
}

/* ---------------------------------- Messages ----------------------------------- */

/** All contact messages, newest first (admin). */
export function getMessages(): Promise<ContactMessage[]> {
  return query(
    "messages",
    () =>
      db
        .select()
        .from(contactMessages)
        .orderBy(desc(contactMessages.createdAt)),
    placeholderMessages,
  );
}

/* ----------------------------------- Profile ----------------------------------- */

/** Owner profile / site settings (first row), localized, with placeholder fallback. */
export async function getProfile(
  locale: Locale = defaultLocale,
): Promise<SiteSettings> {
  const row = await query(
    "site_settings",
    async () => {
      const [r] = await db.select().from(siteSettings).limit(1);
      return r ?? placeholderProfile;
    },
    placeholderProfile,
  );
  return localizeProfile(normalizeSiteSettingsAssets(row), locale);
}

/** Localized About-page content with DB-backed overrides and code fallback. */
export async function getAboutPageContent(
  locale: Locale = defaultLocale,
): Promise<AboutPageContent> {
  const profile = await getProfile(locale);
  return (
    profile.aboutPageContent && normalizeAboutPageContent(profile.aboutPageContent)
  ) ?? getFallbackAboutPageContent(locale, profile);
}

/** Localized Contact-page content with DB-backed overrides and code fallback. */
export async function getContactPageContent(
  locale: Locale = defaultLocale,
): Promise<ContactPageContent> {
  const profile = await getProfile(locale);
  return (
    profile.contactPageContent &&
    normalizeContactPageContent(profile.contactPageContent)
  ) ?? getFallbackContactPageContent(locale, profile);
}

/** Raw profile/site settings for the admin settings form (no localization). */
export function getRawProfile(): Promise<SiteSettings | null> {
  return query(
    "site_settings",
    async () => {
      const [r] = await db.select().from(siteSettings).limit(1);
      return r ? normalizeSiteSettingsAssets(r) : null;
    },
    null,
  );
}

/** Raw localized About content for the admin form, falling back to defaults. */
export async function getRawAboutPageContent(
  locale: Locale = defaultLocale,
): Promise<AboutPageContent> {
  const settings = await getRawProfile();
  const localized =
    locale === "fa"
      ? settings?.aboutPageContentFa ??
        settings?.aboutPageContentEn ??
        settings?.aboutPageContent ??
        null
      : settings?.aboutPageContentEn ??
        settings?.aboutPageContentFa ??
        settings?.aboutPageContent ??
        null;

  return localized
    ? normalizeAboutPageContent(localized)
    : getFallbackAboutPageContent(locale, settings ? localizeProfile(settings, locale) : null);
}

/** Raw localized Contact content for the admin form, falling back to defaults. */
export async function getRawContactPageContent(
  locale: Locale = defaultLocale,
): Promise<ContactPageContent> {
  const settings = await getRawProfile();
  const localized =
    locale === "fa"
      ? settings?.contactPageContentFa ??
        settings?.contactPageContentEn ??
        settings?.contactPageContent ??
        null
      : settings?.contactPageContentEn ??
        settings?.contactPageContentFa ??
        settings?.contactPageContent ??
        null;

  return localized
    ? normalizeContactPageContent(localized)
    : getFallbackContactPageContent(
        locale,
        settings ? localizeProfile(settings, locale) : null,
      );
}
