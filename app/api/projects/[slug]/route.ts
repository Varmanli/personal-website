import { apiSuccess, apiError } from "@/lib/api";
import { getProjectBySlug } from "@/lib/data";

/**
 * GET /api/projects/[slug]
 * Returns a single project by slug.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return apiError("Project not found", 404);
  return apiSuccess(project);
}
