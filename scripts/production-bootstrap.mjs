import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ensureSiteSettingsTableAndRow } from "../db/site-settings-bootstrap.mjs";

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

async function ensureMigrationsTable(sqlClient) {
  await sqlClient.unsafe(`
    create table if not exists ${MIGRATIONS_TABLE} (
      name text primary key,
      applied_at timestamptz not null default now()
    )
  `);
}

async function listMigrationFiles() {
  let entries;
  try {
    entries = await fs.readdir(MIGRATIONS_FOLDER, { withFileTypes: true });
  } catch (error) {
    throw new Error(
      `[bootstrap] Migrations directory not found at ${MIGRATIONS_FOLDER}. ` +
        `Check that the Dockerfile copies db/migrations into the runtime image. Original error: ${error.message}`,
    );
  }
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort();
}

async function applyMigrations(sqlClient) {
  console.log(`[bootstrap] Working directory: ${process.cwd()}`);
  console.log(`[bootstrap] Resolved migrations directory: ${MIGRATIONS_FOLDER}`);

  await ensureMigrationsTable(sqlClient);
  const appliedRows = await sqlClient`
    select name from ${sqlClient(MIGRATIONS_TABLE)} order by name
  `;
  const applied = new Set(appliedRows.map((row) => row.name));
  const files = await listMigrationFiles();

  console.log(`[bootstrap] Migration files found on disk (${files.length}): ${files.join(", ") || "(none)"}`);
  console.log(
    `[bootstrap] Rows already in ${MIGRATIONS_TABLE} (${appliedRows.length}): ` +
      `${appliedRows.map((r) => r.name).join(", ") || "(none)"}`,
  );

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

    // The generic Drizzle-style migration runner above is one path to a
    // correct schema, but it's not the only source of truth for
    // site_settings anymore. Regardless of whether migrations ran, were
    // skipped, or __app_bootstrap_migrations says everything is applied,
    // this inspects the real database and repairs it directly.
    console.log("[bootstrap] Running site_settings schema self-heal (independent of migration tracker).");
    await ensureSiteSettingsTableAndRow(client);

    console.log("[bootstrap] Database bootstrap finished successfully.");
  } catch (error) {
    console.error("[bootstrap] Database bootstrap failed.", error);
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
