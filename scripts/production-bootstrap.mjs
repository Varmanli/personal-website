import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_FOLDER = path.join(__dirname, "..", "db", "migrations");
const BOOTSTRAP_LOCK_KEY = 214748103;

function asBool(value, fallback) {
  if (value == null || value === "") return fallback;
  return value !== "false" && value !== "0";
}

function shouldBootstrap() {
  return asBool(process.env.RUN_DB_BOOTSTRAP_ON_START, process.env.NODE_ENV === "production");
}

function ensureDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Startup bootstrap requires a valid production database connection.",
    );
  }
  return url;
}

function buildDefaultSiteSettings() {
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

function isSchemaDriftError(error) {
  const code = error?.code;
  if (code === "42P01" || code === "42703") return true;
  const message = error instanceof Error ? error.message : String(error);
  return /does not exist|column .* does not exist|relation .* does not exist/i.test(message);
}

async function ensureInitialSiteSettings(sqlClient) {
  const existing = await sqlClient`select id from site_settings limit 1`;
  if (existing.length > 0) {
    console.log("[bootstrap] site_settings row already exists.");
    return;
  }

  console.log("[bootstrap] site_settings row missing. Creating safe default row.");
  const defaults = buildDefaultSiteSettings();
  await sqlClient`
    insert into site_settings (
      owner_name,
      headline,
      bio,
      avatar_url,
      resume_url,
      logo_url,
      favicon_url,
      hero_image_url,
      email,
      location,
      skills,
      owner_name_fa,
      owner_name_en,
      headline_fa,
      headline_en,
      bio_fa,
      bio_en,
      location_fa,
      location_en,
      skills_fa,
      skills_en,
      about_intro,
      about_intro_fa,
      about_intro_en,
      about_page_content,
      about_page_content_fa,
      about_page_content_en,
      contact_page_content,
      contact_page_content_fa,
      contact_page_content_en,
      contact_settings,
      social_links,
      created_at,
      updated_at
    ) values (
      ${defaults.owner_name},
      ${defaults.headline},
      ${defaults.bio},
      ${defaults.avatar_url},
      ${defaults.resume_url},
      ${defaults.logo_url},
      ${defaults.favicon_url},
      ${defaults.hero_image_url},
      ${defaults.email},
      ${defaults.location},
      ${defaults.skills}::jsonb,
      ${defaults.owner_name_fa},
      ${defaults.owner_name_en},
      ${defaults.headline_fa},
      ${defaults.headline_en},
      ${defaults.bio_fa},
      ${defaults.bio_en},
      ${defaults.location_fa},
      ${defaults.location_en},
      ${defaults.skills_fa}::jsonb,
      ${defaults.skills_en}::jsonb,
      ${defaults.about_intro},
      ${defaults.about_intro_fa},
      ${defaults.about_intro_en},
      ${defaults.about_page_content}::jsonb,
      ${defaults.about_page_content_fa}::jsonb,
      ${defaults.about_page_content_en}::jsonb,
      ${defaults.contact_page_content}::jsonb,
      ${defaults.contact_page_content_fa}::jsonb,
      ${defaults.contact_page_content_en}::jsonb,
      ${defaults.contact_settings}::jsonb,
      ${defaults.social_links}::jsonb,
      ${defaults.created_at},
      ${defaults.updated_at}
    )
  `;
}

export async function runProductionBootstrap() {
  if (!shouldBootstrap()) {
    console.log("[bootstrap] RUN_DB_BOOTSTRAP_ON_START disabled. Skipping database bootstrap.");
    return;
  }

  const connectionString = ensureDatabaseUrl();
  const client = postgres(connectionString, {
    max: 1,
    connect_timeout: 10,
  });
  const drizzleDb = drizzle(client);

  try {
    console.log("[bootstrap] Starting database bootstrap.");
    await client`select pg_advisory_lock(${BOOTSTRAP_LOCK_KEY})`;
    console.log("[bootstrap] Applying schema migrations from db/migrations.");
    await migrate(drizzleDb, { migrationsFolder: MIGRATIONS_FOLDER });
    console.log("[bootstrap] Schema migrations complete.");
    await ensureInitialSiteSettings(client);
    console.log("[bootstrap] Database bootstrap finished successfully.");
  } catch (error) {
    if (isSchemaDriftError(error)) {
      console.error(
        "[bootstrap] Database schema is outdated. Run migrations/db push or enable startup bootstrap.",
        error,
      );
    } else {
      console.error("[bootstrap] Database bootstrap failed.", error);
    }
    throw error;
  } finally {
    try {
      await client`select pg_advisory_unlock(${BOOTSTRAP_LOCK_KEY})`;
    } catch {
      // Ignore unlock failures; connection shutdown also releases the lock.
    }
    await client.end({ timeout: 5 });
  }
}

const invokedDirectly =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (invokedDirectly) {
  runProductionBootstrap().catch((error) => {
    console.error("[bootstrap] Production bootstrap failed.", error);
    process.exitCode = 1;
  });
}
