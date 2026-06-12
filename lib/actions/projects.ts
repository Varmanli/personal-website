"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  projects,
  type NewProject,
  type ProjectMetric,
} from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";
import {
  type ActionState,
  STATUS_OPTIONS,
  bool,
  list,
  oneOf,
  str,
  uniqStrings,
} from "@/lib/form";
import { buildBaseSlug, ensureUniqueProjectSlug } from "@/lib/slug";
import { getAdminErrors, toActionError } from "@/lib/actions/shared";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Errs = Dictionary["admin"]["errors"];
type ProjectValues = Omit<NewProject, "slug">;

function parseMetrics(
  form: FormData,
  key: string,
): { items: ProjectMetric[]; error?: string } {
  const raw = form.get(key);
  if (typeof raw !== "string" || !raw.trim()) return { items: [] };

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { items: [] };

    const items: ProjectMetric[] = [];
    for (const item of parsed as Array<{ label?: unknown; value?: unknown }>) {
      const label =
        typeof item?.label === "string" ? item.label.trim() : "";
      const value =
        typeof item?.value === "string" ? item.value.trim() : "";

      if (!label && !value) continue;
      if (!label || !value) {
        return { items: [], error: key };
      }

      items.push({ label, value });
    }

    return { items };
  } catch {
    return { items: [] };
  }
}

function parseHomeOrder(form: FormData): { value: number; error?: string } {
  const raw = str(form, "homeOrder");
  if (!raw) return { value: 0 };

  const num = Number(raw);
  if (!Number.isFinite(num) || num < 0) {
    return { value: 0, error: "homeOrder" };
  }

  return { value: Math.floor(num) };
}

/** Build the insert/update values (without slug — slug is derived separately). */
function readForm(
  form: FormData,
  errs: Errs,
): {
  values: ProjectValues;
  titleEn: string | null;
  titleFa: string | null;
  error?: string;
  fieldErrors?: Record<string, string>;
} {
  const titleFa = str(form, "titleFa") ?? null;
  const titleEn = str(form, "titleEn") ?? null;
  const baseTitle = titleFa ?? titleEn;
  if (!baseTitle) {
    return { values: {} as ProjectValues, titleEn, titleFa, error: errs.titleRequired };
  }

  // Cover image is the primary visual; fall back to a legacy thumbnail value.
  const coverImageUrl = str(form, "coverImageUrl") ?? null;
  if (!coverImageUrl) {
    return { values: {} as ProjectValues, titleEn, titleFa, error: errs.coverRequired };
  }
  const galleryImages = list(form, "galleryImages");

  const shortFa = str(form, "shortDescriptionFa") ?? null;
  const shortEn = str(form, "shortDescriptionEn") ?? null;
  const descFa = str(form, "descriptionFa") ?? null;
  const descEn = str(form, "descriptionEn") ?? null;
  const roleFa = str(form, "roleFa") ?? null;
  const roleEn = str(form, "roleEn") ?? null;
  const clientFa = str(form, "clientFa") ?? null;
  const clientEn = str(form, "clientEn") ?? null;
  // Challenges are now multi-item arrays; mirror into the legacy single
  // challenge* columns (newline-joined) so older consumers keep working.
  const challengesFa = list(form, "challengesFa");
  const challengesEn = list(form, "challengesEn");
  const challengeFa = challengesFa.length ? challengesFa.join("\n\n") : null;
  const challengeEn = challengesEn.length ? challengesEn.join("\n\n") : null;
  const solutionFa = str(form, "solutionFa") ?? null;
  const solutionEn = str(form, "solutionEn") ?? null;
  const outcomeFa = str(form, "outcomeFa") ?? null;
  const outcomeEn = str(form, "outcomeEn") ?? null;
  const tagsFa = list(form, "tagsFa");
  const tagsEn = list(form, "tagsEn");
  const technicalHighlightsFa = list(form, "technicalHighlightsFa");
  const technicalHighlightsEn = list(form, "technicalHighlightsEn");
  const projectTypeFa = str(form, "projectTypeFa") ?? null;
  const projectTypeEn = str(form, "projectTypeEn") ?? null;
  const previewImageUrl = str(form, "previewImageUrl") ?? null;
  const homeOrder = parseHomeOrder(form);
  const homeMetricsFa = parseMetrics(form, "homeMetricsFa");
  const homeMetricsEn = parseMetrics(form, "homeMetricsEn");

  const fieldErrors: Record<string, string> = {};
  if (homeOrder.error) fieldErrors.homeOrder = errs.invalidHomeOrder;
  if (homeMetricsFa.error) fieldErrors.homeMetricsFa = errs.invalidMetric;
  if (homeMetricsEn.error) fieldErrors.homeMetricsEn = errs.invalidMetric;
  if (Object.keys(fieldErrors).length > 0) {
    return {
      values: {} as ProjectValues,
      titleEn,
      titleFa,
      error: errs.invalidMetric,
      fieldErrors,
    };
  }

  const values: ProjectValues = {
    // Base/legacy fields kept populated for fallback + non-localized consumers.
    title: baseTitle,
    shortDescription: shortFa ?? shortEn,
    description: descFa ?? descEn,
    role: roleFa ?? roleEn,
    client: clientFa ?? clientEn,
    projectType: projectTypeFa ?? projectTypeEn,
    challenge: challengeFa ?? challengeEn,
    solution: solutionFa ?? solutionEn,
    outcome: outcomeFa ?? outcomeEn,
    tags: tagsFa.length ? tagsFa : tagsEn,
    homeMetrics: homeMetricsFa.items.length
      ? homeMetricsFa.items
      : homeMetricsEn.items,
    technicalHighlights: technicalHighlightsFa.length
      ? technicalHighlightsFa
      : technicalHighlightsEn,
    // Localized fields.
    titleFa,
    titleEn,
    shortDescriptionFa: shortFa,
    shortDescriptionEn: shortEn,
    descriptionFa: descFa,
    descriptionEn: descEn,
    roleFa,
    roleEn,
    clientFa,
    clientEn,
    projectTypeFa,
    projectTypeEn,
    homeMetricsFa: homeMetricsFa.items,
    homeMetricsEn: homeMetricsEn.items,
    technicalHighlightsFa,
    technicalHighlightsEn,
    challengeFa,
    challengeEn,
    challengesFa,
    challengesEn,
    solutionFa,
    solutionEn,
    outcomeFa,
    outcomeEn,
    tagsFa,
    tagsEn,
    // Shared fields.
    coverImageUrl,
    previewImageUrl,
    galleryImages,
    // Mirror cover into the legacy thumbnail so older fallbacks keep working.
    thumbnailUrl: coverImageUrl,
    technologies: uniqStrings(list(form, "technologies")),
    year: str(form, "year") ?? null,
    liveUrl: str(form, "liveUrl") ?? null,
    repoUrl: str(form, "repoUrl") ?? null,
    status: oneOf(str(form, "status"), STATUS_OPTIONS, "draft"),
    isFeatured: bool(form, "isFeatured"),
    isFeaturedOnHome: bool(form, "isFeaturedOnHome"),
    homeOrder: homeOrder.value,
  };
  return { values, titleEn, titleFa };
}

export async function createProject(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const { values, titleEn, titleFa, error, fieldErrors } = readForm(form, errs);
  if (error) return { error, fieldErrors };

  try {
    const base = buildBaseSlug({ titleEn, titleFa, title: values.title }, "project");
    const slug = await ensureUniqueProjectSlug(base);
    await db.insert(projects).values({ ...values, slug });
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProject(
  id: number,
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const { values, titleEn, titleFa, error, fieldErrors } = readForm(form, errs);
  if (error) return { error, fieldErrors };

  let slug: string;
  try {
    // Preserve the existing slug; only generate one if it's missing.
    const [existing] = await db
      .select({ slug: projects.slug })
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);
    slug = existing?.slug?.trim()
      ? existing.slug
      : await ensureUniqueProjectSlug(
          buildBaseSlug({ titleEn, titleFa, title: values.title }, "project"),
          id,
        );

    await db
      .update(projects)
      .set({ ...values, slug, updatedAt: new Date() })
      .where(eq(projects.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProject(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const id = Number(form.get("id"));
  if (Number.isNaN(id)) return { error: errs.invalidId };

  try {
    await db.delete(projects).where(eq(projects.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  return {};
}
