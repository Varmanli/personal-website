import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages, type NewContactMessage } from "@/db/schema";
import { apiSuccess, apiError, requireAdmin } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

/**
 * GET    /api/admin/messages/[id] — fetch one message.
 * PUT    /api/admin/messages/[id] — update a message (e.g. mark read/archived).
 * DELETE /api/admin/messages/[id] — delete a message.
 */
export async function GET(_request: Request, { params }: Ctx) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid id");

  try {
    const [row] = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id));
    if (!row) return apiError("Message not found", 404);
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

  let body: Partial<Pick<NewContactMessage, "status">>;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body");
  }

  try {
    const [row] = await db
      .update(contactMessages)
      .set({ status: body.status, updatedAt: new Date() })
      .where(eq(contactMessages.id, id))
      .returning();
    if (!row) return apiError("Message not found", 404);
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
      .delete(contactMessages)
      .where(eq(contactMessages.id, id))
      .returning();
    if (!row) return apiError("Message not found", 404);
    return apiSuccess({ id: row.id, deleted: true });
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Database error", 500);
  }
}
