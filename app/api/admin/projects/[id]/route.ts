import { eq } from "drizzle-orm";
import { db } from "@/db";
import { projects, type NewProject } from "@/db/schema";
import { apiSuccess, apiError, requireAdmin } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

/**
 * GET    /api/admin/projects/[id] — fetch one project.
 * PUT    /api/admin/projects/[id] — update a project.
 * DELETE /api/admin/projects/[id] — delete a project.
 */
export async function GET(_request: Request, { params }: Ctx) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid id");

  try {
    const [row] = await db.select().from(projects).where(eq(projects.id, id));
    if (!row) return apiError("Project not found", 404);
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

  let body: Partial<NewProject>;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body");
  }

  try {
    const [row] = await db
      .update(projects)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    if (!row) return apiError("Project not found", 404);
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
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    if (!row) return apiError("Project not found", 404);
    return apiSuccess({ id: row.id, deleted: true });
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Database error", 500);
  }
}
