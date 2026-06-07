/**
 * Database seed script.
 *
 * Run with:  npm run db:seed
 * Requires DATABASE_URL to be set and the schema to be applied
 * (npm run db:push  OR  npm run db:generate && npm run db:migrate).
 *
 * Seeds the same placeholder content used by the UI fallbacks so the site has
 * real data to read from once the database is connected.
 */
import { db } from "./index";
import {
  projects,
  services,
  portfolioItems,
  siteSettings,
} from "./schema";
import {
  placeholderProjects,
  placeholderServices,
  placeholderPortfolio,
  placeholderProfile,
} from "../lib/placeholder-data";

async function seed() {
  console.log("Seeding database…");

  // Strip generated columns so Postgres assigns them.
  const stripMeta = <T extends { id: number; createdAt: Date; updatedAt: Date }>(
    rows: T[],
  ) =>
    rows.map(({ id: _id, createdAt: _c, updatedAt: _u, ...rest }) => {
      void _id;
      void _c;
      void _u;
      return rest;
    });

  await db.insert(projects).values(stripMeta(placeholderProjects));
  await db.insert(services).values(stripMeta(placeholderServices));
  await db.insert(portfolioItems).values(stripMeta(placeholderPortfolio));

  const { id: _pid, createdAt: _pc, updatedAt: _pu, ...profile } =
    placeholderProfile;
  void _pid;
  void _pc;
  void _pu;
  await db.insert(siteSettings).values(profile);

  console.log("Seed complete.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
