import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Drizzle database client.
 *
 * The underlying `postgres` client is lazy — it parses the connection string
 * at construction but does NOT open a socket until the first query runs. That
 * means importing this module is safe at build time even when `DATABASE_URL`
 * is unset; queries will simply throw at runtime, which the API routes catch.
 *
 * Usage:
 *   import { db } from "@/db";
 *   import { projects } from "@/db/schema";
 *   const rows = await db.select().from(projects);
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV === "production") {
  throw new Error(
    "DATABASE_URL is not set. Add DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE to the production environment before starting the app.",
  );
}

// Reuse a single client across HMR reloads in dev to avoid exhausting the pool.
const globalForDb = globalThis as unknown as {
  client?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.client ??
  postgres(connectionString ?? "postgres://localhost:5432/postgres", {
    max: 10,
    // Fail fast instead of hanging when there's no reachable database.
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });

export { schema };
