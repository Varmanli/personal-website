import { eq } from "drizzle-orm";
import { db } from "@/db";
import { services, type NewService } from "@/db/schema";
import { apiSuccess, apiError, requireAdmin } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

/**
 * GET    /api/admin/services/[id] — fetch one service.
 * PUT    /api/admin/services/[id] — update a service.
 * DELETE /api/admin/services/[id] — delete a service.
 */
export async function GET(_request: Request, { params }: Ctx) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid id");

  try {
    const [row] = await db.select().from(services).where(eq(services.id, id));
    if (!row) return apiError("Service not found", 404);
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

  let body: Partial<NewService>;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body");
  }

  try {
    const [row] = await db
      .update(services)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    if (!row) return apiError("Service not found", 404);
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
      .delete(services)
      .where(eq(services.id, id))
      .returning();
    if (!row) return apiError("Service not found", 404);
    return apiSuccess({ id: row.id, deleted: true });
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Database error", 500);
  }
}
