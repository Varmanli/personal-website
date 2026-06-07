import { apiSuccess } from "@/lib/api";
import { getPublishedServices } from "@/lib/data";

/**
 * GET /api/services
 * Returns published services/plans. The data layer falls back to placeholder
 * content if the database is unreachable (see lib/data.ts).
 */
export async function GET() {
  const rows = await getPublishedServices();
  return apiSuccess(rows);
}
