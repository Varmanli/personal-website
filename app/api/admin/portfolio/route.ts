import { db } from "@/db";
import { portfolioItems, type NewPortfolioItem } from "@/db/schema";
import { apiSuccess, apiError, requireAdmin } from "@/lib/api";
import { slugify } from "@/lib/utils";

/**
 * GET  /api/admin/portfolio — list all portfolio items.
 * POST /api/admin/portfolio — create a portfolio item.
 */
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const rows = await db.select().from(portfolioItems);
    return apiSuccess(rows);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Database error", 500);
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body: Partial<NewPortfolioItem>;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body");
  }

  if (!body.title) return apiError("title is required");

  const values: NewPortfolioItem = {
    ...body,
    title: body.title,
    slug: body.slug?.trim() || slugify(body.title),
  };

  try {
    const [row] = await db.insert(portfolioItems).values(values).returning();
    return apiSuccess(row, 201);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Database error", 500);
  }
}
