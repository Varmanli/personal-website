import { eq } from "drizzle-orm";
import { db } from "@/db";
import { portfolioItems, type NewPortfolioItem } from "@/db/schema";
import { apiSuccess, apiError, requireAdmin } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

/**
 * GET    /api/admin/portfolio/[id] — fetch one portfolio item.
 * PUT    /api/admin/portfolio/[id] — update a portfolio item.
 * DELETE /api/admin/portfolio/[id] — delete a portfolio item.
 */
export async function GET(_request: Request, { params }: Ctx) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid id");

  try {
    const [row] = await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.id, id));
    if (!row) return apiError("Portfolio item not found", 404);
    return apiSuccess(row);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Database error", 500);
  }
}

export async function PUT(request: Request, { params }: Ctx) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid id");

  let body: Partial<NewPortfolioItem>;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body");
  }

  try {
    const [row] = await db
      .update(portfolioItems)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(portfolioItems.id, id))
      .returning();
    if (!row) return apiError("Portfolio item not found", 404);
    return apiSuccess(row);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Database error", 500);
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid id");

  try {
    const [row] = await db
      .delete(portfolioItems)
      .where(eq(portfolioItems.id, id))
      .returning();
    if (!row) return apiError("Portfolio item not found", 404);
    return apiSuccess({ id: row.id, deleted: true });
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Database error", 500);
  }
}
