import { apiSuccess } from "@/lib/api";
import { getPublishedProjects } from "@/lib/data";

/**
 * GET /api/projects
 * Returns published projects. The data layer falls back to placeholder content
 * if the database is unreachable (see lib/data.ts).
 */
export async function GET() {
  const rows = await getPublishedProjects();
  return apiSuccess(rows);
}
