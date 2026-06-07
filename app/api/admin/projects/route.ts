import { db } from "@/db";
import { projects, type NewProject } from "@/db/schema";
import { apiSuccess, apiError, requireAdmin } from "@/lib/api";
import { slugify } from "@/lib/utils";

/**
 * GET /api/admin/projects — list all projects (any status).
 * POST /api/admin/projects — create a project.
 */
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const rows = await db.select().from(projects);
    return apiSuccess(rows);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Database error", 500);
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body: Partial<NewProject>;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body");
  }

  if (!body.title) return apiError("title is required");

  const values: NewProject = {
    ...body,
    title: body.title,
    slug: body.slug?.trim() || slugify(body.title),
  };

  try {
    const [row] = await db.insert(projects).values(values).returning();
    return apiSuccess(row, 201);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : "Database error", 500);
  }
}
