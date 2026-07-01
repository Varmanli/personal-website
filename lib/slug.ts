import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { projects, services } from "@/db/schema";

/**
 * Slug generation — server-side source of truth.
 *
 * Admins never type slugs. On create we derive one from the best available
 * title and guarantee uniqueness; on update we keep the existing slug so public
 * links never break.
 */

/** Normalise a string into a URL-safe slug (ASCII only). */
export function slugify(input: string): string {
  return (input ?? "")
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "") // drop unsafe / non-ASCII (incl. Persian)
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Pick the best raw source string for a slug: prefer English, then Persian,
 * then the legacy base title. (Persian typically sanitises to empty, which is
 * why callers fall back to a timestamped slug.)
 */
export function createSlugSource({
  titleEn,
  titleFa,
  title,
}: {
  titleEn?: string | null;
  titleFa?: string | null;
  title?: string | null;
}): string {
  return (titleEn || titleFa || title || "").trim();
}

/**
 * Build a base slug from titles, falling back to `${prefix}-${timestamp}` when
 * the source has no ASCII characters (e.g. a Persian-only title).
 */
export function buildBaseSlug(
  source: { titleEn?: string | null; titleFa?: string | null; title?: string | null },
  prefix: string,
): string {
  const base = slugify(createSlugSource(source));
  return base || `${prefix}-${Date.now()}`;
}

async function makeUnique(
  base: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  let candidate = base;
  let n = 2;
  // Bounded loop: each conflicting candidate appends -2, -3, … until free.
  while (await exists(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

/** Ensure a project slug is unique (ignoring `existingId` on edit). */
export function ensureUniqueProjectSlug(
  base: string,
  existingId?: number,
): Promise<string> {
  return makeUnique(base, async (candidate) => {
    const where =
      existingId != null
        ? and(eq(projects.slug, candidate), ne(projects.id, existingId))
        : eq(projects.slug, candidate);
    const [row] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(where)
      .limit(1);
    return Boolean(row);
  });
}

/** Ensure a service slug is unique (ignoring `existingId` on edit). */
export function ensureUniqueServiceSlug(
  base: string,
  existingId?: number,
): Promise<string> {
  return makeUnique(base, async (candidate) => {
    const where =
      existingId != null
        ? and(eq(services.slug, candidate), ne(services.id, existingId))
        : eq(services.slug, candidate);
    const [row] = await db
      .select({ id: services.id })
      .from(services)
      .where(where)
      .limit(1);
    return Boolean(row);
  });
}
