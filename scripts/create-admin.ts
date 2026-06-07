/**
 * Create (or update) an admin user.
 *
 * Usage:
 *   npm run admin:create -- <email> <password> [name]
 *
 * Requires DATABASE_URL to be set and the schema applied (npm run db:push).
 * Passwords are stored as scrypt hashes — never in plain text.
 */

import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const [, , emailArg, password, name] = process.argv;

  if (!emailArg || !password) {
    console.error("Usage: npm run admin:create -- <email> <password> [name]");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error(
      "DATABASE_URL is not set. Check your .env or .env.local file.",
    );
    process.exit(1);
  }

  const [{ eq }, { db }, { adminUsers }, { hashPassword }] = await Promise.all([
    import("drizzle-orm"),
    import("../db"),
    import("../db/schema"),
    import("../lib/password"),
  ]);

  const email = emailArg.toLowerCase();
  const passwordHash = hashPassword(password);

  const [existing] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  if (existing) {
    await db
      .update(adminUsers)
      .set({
        passwordHash,
        name: name ?? null,
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, existing.id));

    console.log(`Updated existing admin: ${email}`);
  } else {
    await db.insert(adminUsers).values({
      email,
      passwordHash,
      name: name ?? null,
    });

    console.log(`Created admin: ${email}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to create admin:", err);
    process.exit(1);
  });
