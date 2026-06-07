import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { apiSuccess, apiError, requireAdmin } from "@/lib/api";

/**
 * GET /api/admin/messages — list all contact messages (newest-first intent;
 * ordering can be added later). Messages are created via POST /api/contact.
 */
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const rows = await db.select().from(contactMessages);
    return apiSuccess(rows);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Database error", 500);
  }
}
