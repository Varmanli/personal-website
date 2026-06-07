import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit configuration.
 * Drives `drizzle-kit generate`, `migrate`, `push`, and `studio`.
 */
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  verbose: true,
  strict: true,
});
