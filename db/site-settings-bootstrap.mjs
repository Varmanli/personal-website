/**
 * Single source of truth for making the `site_settings` table self-healing.
 *
 * This is plain, dependency-free JavaScript (no drizzle-orm import) because it
 * must run two ways that cannot both go through the TypeScript/bundler
 * pipeline:
 *   1. From scripts/production-bootstrap.mjs, executed directly by `node` in
 *      the production standalone image (no ts-node/tsx available there).
 *   2. From lib/site-settings.ts, bundled by Next.js as part of the app, as a
 *      defensive repair-and-retry path if a settings read/save fails with a
 *      schema error even though startup bootstrap didn't catch it.
 *
 * It only needs a postgres.js-compatible tagged-template client (the same
 * `sql` interface both callers already have — see db/index.ts and
 * scripts/production-bootstrap.mjs), so it has no reason to depend on
 * drizzle-orm at all.
 *
 * Everything here is additive and non-destructive: CREATE TABLE IF NOT
 * EXISTS, ADD COLUMN IF NOT EXISTS, and an INSERT that only ever runs when
 * the table is confirmed empty. No column is ever dropped or altered, and no
 * existing row is ever overwritten.
 */

// Matches the lock key already used by lib/site-settings.ts (ensureSiteSettings /
// saveSiteSettings) so this repair step can never race a concurrent admin save.
const SITE_SETTINGS_LOCK_KEY = 214748102;

// The full site_settings table, matching db/schema.ts exactly. Used verbatim
// when the table doesn't exist at all.
const CREATE_TABLE_SQL = `
  create table if not exists "site_settings" (
    "id" serial primary key not null,
    "owner_name" varchar(200) not null,
    "headline" varchar(320),
    "bio" text,
    "avatar_url" text,
    "resume_url" text,
    "logo_url" text,
    "favicon_url" text,
    "hero_image_url" text,
    "email" varchar(320),
    "location" varchar(200),
    "skills" jsonb default '[]'::jsonb,
    "owner_name_fa" varchar(200),
    "owner_name_en" varchar(200),
    "headline_fa" varchar(320),
    "headline_en" varchar(320),
    "bio_fa" text,
    "bio_en" text,
    "location_fa" varchar(200),
    "location_en" varchar(200),
    "skills_fa" jsonb default '[]'::jsonb,
    "skills_en" jsonb default '[]'::jsonb,
    "about_intro" text,
    "about_intro_fa" text,
    "about_intro_en" text,
    "about_page_content" jsonb,
    "about_page_content_fa" jsonb,
    "about_page_content_en" jsonb,
    "contact_page_content" jsonb,
    "contact_page_content_fa" jsonb,
    "contact_page_content_en" jsonb,
    "contact_settings" jsonb,
    "social_links" jsonb default '[]'::jsonb,
    "created_at" timestamp with time zone default now() not null,
    "updated_at" timestamp with time zone default now() not null
  )
`;

// Every column site_settings is expected to have, with the exact ADD COLUMN
// clause to use if it's missing on an existing table. "id" is deliberately
// excluded — it's the serial primary key and only ever created via
// CREATE_TABLE_SQL; a table missing "id" is a different problem than schema
// drift and isn't something ADD COLUMN can safely fix.
const EXPECTED_COLUMNS = [
  { name: "owner_name", addColumnDdl: `varchar(200) not null default ''` },
  { name: "headline", addColumnDdl: `varchar(320)` },
  { name: "bio", addColumnDdl: `text` },
  { name: "avatar_url", addColumnDdl: `text` },
  { name: "resume_url", addColumnDdl: `text` },
  { name: "logo_url", addColumnDdl: `text` },
  { name: "favicon_url", addColumnDdl: `text` },
  { name: "hero_image_url", addColumnDdl: `text` },
  { name: "email", addColumnDdl: `varchar(320)` },
  { name: "location", addColumnDdl: `varchar(200)` },
  { name: "skills", addColumnDdl: `jsonb default '[]'::jsonb` },
  { name: "owner_name_fa", addColumnDdl: `varchar(200)` },
  { name: "owner_name_en", addColumnDdl: `varchar(200)` },
  { name: "headline_fa", addColumnDdl: `varchar(320)` },
  { name: "headline_en", addColumnDdl: `varchar(320)` },
  { name: "bio_fa", addColumnDdl: `text` },
  { name: "bio_en", addColumnDdl: `text` },
  { name: "location_fa", addColumnDdl: `varchar(200)` },
  { name: "location_en", addColumnDdl: `varchar(200)` },
  { name: "skills_fa", addColumnDdl: `jsonb default '[]'::jsonb` },
  { name: "skills_en", addColumnDdl: `jsonb default '[]'::jsonb` },
  { name: "about_intro", addColumnDdl: `text` },
  { name: "about_intro_fa", addColumnDdl: `text` },
  { name: "about_intro_en", addColumnDdl: `text` },
  { name: "about_page_content", addColumnDdl: `jsonb` },
  { name: "about_page_content_fa", addColumnDdl: `jsonb` },
  { name: "about_page_content_en", addColumnDdl: `jsonb` },
  { name: "contact_page_content", addColumnDdl: `jsonb` },
  { name: "contact_page_content_fa", addColumnDdl: `jsonb` },
  { name: "contact_page_content_en", addColumnDdl: `jsonb` },
  { name: "contact_settings", addColumnDdl: `jsonb` },
  { name: "social_links", addColumnDdl: `jsonb default '[]'::jsonb` },
  { name: "created_at", addColumnDdl: `timestamp with time zone default now() not null` },
  { name: "updated_at", addColumnDdl: `timestamp with time zone default now() not null` },
];

function log(message) {
  console.log(`[site-settings-bootstrap] ${message}`);
}

function warn(message, error) {
  console.warn(`[site-settings-bootstrap] ${message}`, error ?? "");
}

async function tableExists(tx) {
  const [{ exists }] = await tx`
    select exists (
      select 1 from information_schema.tables
      where table_schema = current_schema() and table_name = 'site_settings'
    ) as exists
  `;
  return exists;
}

async function getExistingColumns(tx) {
  const rows = await tx`
    select column_name from information_schema.columns
    where table_schema = current_schema() and table_name = 'site_settings'
  `;
  return new Set(rows.map((row) => row.column_name));
}

function buildDefaultRow() {
  const now = new Date();
  return {
    owner_name: "Varmanli",
    headline: "Full-stack developer building commercial web apps",
    bio: "I'm a full-stack developer who helps founders and small teams turn ideas into fast, reliable web products.",
    avatar_url: null,
    resume_url: null,
    logo_url: null,
    favicon_url: null,
    hero_image_url: null,
    email: null,
    location: "Remote / Worldwide",
    skills: JSON.stringify([
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Tailwind CSS",
      "Drizzle ORM",
    ]),
    owner_name_fa: null,
    owner_name_en: null,
    headline_fa: null,
    headline_en: null,
    bio_fa: null,
    bio_en: null,
    location_fa: null,
    location_en: null,
    skills_fa: JSON.stringify([]),
    skills_en: JSON.stringify([]),
    about_intro: null,
    about_intro_fa: null,
    about_intro_en: null,
    about_page_content: null,
    about_page_content_fa: null,
    about_page_content_en: null,
    contact_page_content: null,
    contact_page_content_fa: null,
    contact_page_content_en: null,
    contact_settings: null,
    social_links: JSON.stringify([]),
    created_at: now,
    updated_at: now,
  };
}

async function insertDefaultRow(tx) {
  const d = buildDefaultRow();
  await tx`
    insert into site_settings (
      owner_name, headline, bio, avatar_url, resume_url, logo_url, favicon_url,
      hero_image_url, email, location, skills, owner_name_fa, owner_name_en,
      headline_fa, headline_en, bio_fa, bio_en, location_fa, location_en,
      skills_fa, skills_en, about_intro, about_intro_fa, about_intro_en,
      about_page_content, about_page_content_fa, about_page_content_en,
      contact_page_content, contact_page_content_fa, contact_page_content_en,
      contact_settings, social_links, created_at, updated_at
    ) values (
      ${d.owner_name}, ${d.headline}, ${d.bio}, ${d.avatar_url}, ${d.resume_url},
      ${d.logo_url}, ${d.favicon_url}, ${d.hero_image_url}, ${d.email}, ${d.location},
      ${d.skills}::jsonb, ${d.owner_name_fa}, ${d.owner_name_en}, ${d.headline_fa},
      ${d.headline_en}, ${d.bio_fa}, ${d.bio_en}, ${d.location_fa}, ${d.location_en},
      ${d.skills_fa}::jsonb, ${d.skills_en}::jsonb, ${d.about_intro}, ${d.about_intro_fa},
      ${d.about_intro_en}, ${d.about_page_content}::jsonb, ${d.about_page_content_fa}::jsonb,
      ${d.about_page_content_en}::jsonb, ${d.contact_page_content}::jsonb,
      ${d.contact_page_content_fa}::jsonb, ${d.contact_page_content_en}::jsonb,
      ${d.contact_settings}::jsonb, ${d.social_links}::jsonb, ${d.created_at}, ${d.updated_at}
    )
  `;
}

/**
 * Make `site_settings` match the current app schema and have at least one
 * row, regardless of what migrations or the migration tracker say. Safe to
 * call on every startup and as an on-demand repair before a read/save retry.
 *
 * @param {import("postgres").Sql} sql a postgres.js tagged-template client
 */
export async function ensureSiteSettingsTableAndRow(sql) {
  await sql.begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(${SITE_SETTINGS_LOCK_KEY})`;

    const existed = await tableExists(tx);
    if (!existed) {
      log("table missing, creating full table");
      await tx.unsafe(CREATE_TABLE_SQL);
      log("table created");
    } else {
      log("table exists");
    }

    const existingColumns = await getExistingColumns(tx);
    const missing = EXPECTED_COLUMNS.filter((c) => !existingColumns.has(c.name));

    if (missing.length > 0) {
      log(`missing columns: ${missing.map((c) => c.name).join(", ")}`);
      for (const column of missing) {
        await tx.unsafe(
          `alter table "site_settings" add column if not exists "${column.name}" ${column.addColumnDdl}`,
        );
        log(`added column: ${column.name}`);
      }
    }

    const [{ count }] = await tx`select count(*)::int as count from site_settings`;
    if (count === 0) {
      log("row missing, creating initial row");
      await insertDefaultRow(tx);
    }

    log("complete");
  });
}
