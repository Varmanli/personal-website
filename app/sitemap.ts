import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/data";
import { siteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

/** Public sitemap: static marketing routes + every published project. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { path: "/", priority: 1, changeFrequency: "weekly" },
      { path: "/about", priority: 0.8, changeFrequency: "monthly" },
      { path: "/projects", priority: 0.8, changeFrequency: "weekly" },
      { path: "/services", priority: 0.8, changeFrequency: "monthly" },
      { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
      { path: "/start-project", priority: 0.6, changeFrequency: "yearly" },
    ] as const
  ).map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await getPublishedProjects();
    projectRoutes = projects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      lastModified: project.updatedAt ?? now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    // Sitemap should still resolve if project data is unavailable.
  }

  return [...staticRoutes, ...projectRoutes];
}
