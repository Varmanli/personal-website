"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { portfolioItems, type NewPortfolioItem } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";
import {
  type ActionState,
  PORTFOLIO_TYPES,
  STATUS_OPTIONS,
  bool,
  list,
  oneOf,
  str,
  uniqStrings,
} from "@/lib/form";
import { buildBaseSlug, ensureUniquePortfolioSlug } from "@/lib/slug";
import { getAdminErrors, toActionError } from "@/lib/actions/shared";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Errs = Dictionary["admin"]["errors"];
type PortfolioValues = Omit<NewPortfolioItem, "slug">;

function readForm(
  form: FormData,
  errs: Errs,
): {
  values: PortfolioValues;
  titleEn: string | null;
  titleFa: string | null;
  error?: string;
} {
  const titleFa = str(form, "titleFa") ?? null;
  const titleEn = str(form, "titleEn") ?? null;
  const baseTitle = titleFa ?? titleEn;
  if (!baseTitle) {
    return {
      values: {} as PortfolioValues,
      titleEn,
      titleFa,
      error: errs.titleRequired,
    };
  }

  const descFa = str(form, "descriptionFa") ?? null;
  const descEn = str(form, "descriptionEn") ?? null;
  const coverImageUrl = str(form, "coverImageUrl") ?? null;
  const galleryImages = list(form, "galleryImages");

  const values: PortfolioValues = {
    title: baseTitle,
    description: descFa ?? descEn,
    titleFa,
    titleEn,
    descriptionFa: descFa,
    descriptionEn: descEn,
    coverImageUrl,
    galleryImages,
    technologies: uniqStrings(list(form, "technologies")),
    // Mirror cover into the legacy imageUrl so older fallbacks keep working.
    imageUrl: coverImageUrl,
    type: oneOf(str(form, "type"), PORTFOLIO_TYPES, "personal"),
    externalUrl: str(form, "externalUrl") ?? null,
    status: oneOf(str(form, "status"), STATUS_OPTIONS, "draft"),
    isFeatured: bool(form, "isFeatured"),
  };
  return { values, titleEn, titleFa };
}

export async function createPortfolioItem(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const { values, titleEn, titleFa, error } = readForm(form, errs);
  if (error) return { error };

  try {
    const base = buildBaseSlug(
      { titleEn, titleFa, title: values.title },
      "portfolio",
    );
    const slug = await ensureUniquePortfolioSlug(base);
    await db.insert(portfolioItems).values({ ...values, slug });
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  redirect("/admin/portfolio");
}

export async function updatePortfolioItem(
  id: number,
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const { values, titleEn, titleFa, error } = readForm(form, errs);
  if (error) return { error };

  try {
    const [existing] = await db
      .select({ slug: portfolioItems.slug })
      .from(portfolioItems)
      .where(eq(portfolioItems.id, id))
      .limit(1);
    const slug = existing?.slug?.trim()
      ? existing.slug
      : await ensureUniquePortfolioSlug(
          buildBaseSlug({ titleEn, titleFa, title: values.title }, "portfolio"),
          id,
        );

    await db
      .update(portfolioItems)
      .set({ ...values, slug, updatedAt: new Date() })
      .where(eq(portfolioItems.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  redirect("/admin/portfolio");
}

export async function deletePortfolioItem(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const id = Number(form.get("id"));
  if (Number.isNaN(id)) return { error: errs.invalidId };

  try {
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  return {};
}
