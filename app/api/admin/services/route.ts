import { db } from "@/db";
import { services, type NewService } from "@/db/schema";
import { apiSuccess, apiError, requireAdmin } from "@/lib/api";
import { slugify } from "@/lib/utils";

/**
 * GET  /api/admin/services — list all services/plans.
 * POST /api/admin/services — create a service/plan.
 */
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const rows = await db.select().from(services);
    return apiSuccess(rows);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Database error", 500);
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body: Partial<NewService>;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body");
  }

  if (!body.name) return apiError("name is required");

  const values: NewService = {
    ...body,
    name: body.name,
    slug: body.slug?.trim() || slugify(body.name),
  };

  try {
    const [row] = await db.insert(services).values(values).returning();
    return apiSuccess(row, 201);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Database error", 500);
  }
}
