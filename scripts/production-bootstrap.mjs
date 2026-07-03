import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_FOLDER = path.join(__dirname, "..", "db", "migrations");
const BOOTSTRAP_LOCK_KEY = 214748103;
const MIGRATIONS_TABLE = "__app_bootstrap_migrations";

function isBootstrapEnabled() {
  return process.env.RUN_DB_BOOTSTRAP_ON_START === "true";
}

function isFailHardEnabled() {
  return process.env.DB_BOOTSTRAP_FAIL_HARD === "true";
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

async function loadPostgres() {
  const mod = await import("postgres");
  return mod.default;
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

// Postgres "already exists" codes: duplicate_object, duplicate_table,
// duplicate_column, duplicate_function, duplicate_schema. If a migration
// creates something that's already there, the desired end-state already
// holds — this happens whenever a database's schema was originally
// provisioned with `drizzle-kit push` before this migration tracker existed,
// so the baseline migration (0000) re-creates types/tables it already made.
// Treating it as already-applied (rather than aborting the whole run) is
// what lets later migrations that add real missing columns actually run.
const ALREADY_EXISTS_CODES = new Set(["42710", "42P07", "42701", "42723", "42P06"]);

function isAlreadyExistsError(error) {
  const code = error?.code;
  if (typeof code === "string" && ALREADY_EXISTS_CODES.has(code)) return true;
  const message = error instanceof Error ? error.message : String(error);
  return /already exists/i.test(message);
}

function isSchemaDriftError(error) {
  const code = error?.code;
  if (code === "42P01" || code === "42703") return true;
  const message = error instanceof Error ? error.message : String(error);
  return /does not exist|column .* does not exist|relation .* does not exist/i.test(message);
}

async function ensureMigrationsTable(sqlClient) {
  await sqlClient.unsafe(`
    create table if not exists ${MIGRATIONS_TABLE} (
      name text primary key,
      applied_at timestamptz not null default now()
    )
  `);
}

async function listMigrationFiles() {
  const entries = await fs.readdir(MIGRATIONS_FOLDER, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort();
}

async function applyMigrations(sqlClient) {
  await ensureMigrationsTable(sqlClient);
  const appliedRows = await sqlClient`
    select name from ${sqlClient(MIGRATIONS_TABLE)}
  `;
  const applied = new Set(appliedRows.map((row) => row.name));
  const files = await listMigrationFiles();

  const pending = files.filter((file) => !applied.has(file));
  if (pending.length === 0) {
    console.log("[bootstrap] No pending migrations. Schema is up to date.");
    return;
  }
  console.log(`[bootstrap] Pending migrations: ${pending.join(", ")}`);

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`[bootstrap] Skipping already-applied migration ${file}.`);
      continue;
    }
    const fullPath = path.join(MIGRATIONS_FOLDER, file);
    const sqlText = await fs.readFile(fullPath, "utf8");
    console.log(`[bootstrap] Applying migration ${file}.`);
    try {
      // Run the migration and its tracking-row insert atomically so a failure
      // partway through a multi-statement file never leaves it half-applied
      // and unmarked (which would otherwise retry non-idempotent statements
      // like plain ADD COLUMN and fail with "column already exists").
      await sqlClient.begin(async (tx) => {
        await tx.unsafe(sqlText);
        await tx`
          insert into ${tx(MIGRATIONS_TABLE)} (name)
          values (${file})
          on conflict (name) do nothing
        `;
      });
      console.log(`[bootstrap] Applied migration ${file}.`);
    } catch (error) {
      if (isAlreadyExistsError(error)) {
        console.warn(
          `[bootstrap] Migration ${file} was rolled back because its objects already exist ` +
            `(schema was likely provisioned by drizzle-kit push before this tracker existed). ` +
            `Marking it as applied without re-running.`,
          error.message ?? error,
        );
        await sqlClient`
          insert into ${sqlClient(MIGRATIONS_TABLE)} (name)
          values (${file})
          on conflict (name) do nothing
        `;
        continue;
      }
      console.error(`[bootstrap] Migration ${file} failed and was rolled back.`, error);
      throw error;
    }
  }
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
  if (!isBootstrapEnabled()) {
    console.log("[bootstrap] RUN_DB_BOOTSTRAP_ON_START is not 'true'. Skipping database bootstrap.");
    return;
  }

  const connectionString = ensureDatabaseUrl();
  const postgres = await loadPostgres();
  const client = postgres(connectionString, {
    max: 1,
    connect_timeout: 10,
  });

  try {
    console.log("[bootstrap] Starting database bootstrap.");
    await client`select pg_advisory_lock(${BOOTSTRAP_LOCK_KEY})`;
    await applyMigrations(client);
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
    process.exitCode = isFailHardEnabled() ? 1 : 0;
  });
}
