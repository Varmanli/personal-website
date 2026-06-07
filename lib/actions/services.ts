"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { services, type NewService } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";
import {
  type ActionState,
  STATUS_OPTIONS,
  bool,
  list,
  oneOf,
  parsePriceCents,
  str,
} from "@/lib/form";
import { buildBaseSlug, ensureUniqueServiceSlug } from "@/lib/slug";
import { getAdminErrors, toActionError } from "@/lib/actions/shared";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Errs = Dictionary["admin"]["errors"];
type ServiceValues = Omit<NewService, "slug">;

function readForm(
  form: FormData,
  errs: Errs,
): { values: ServiceValues; nameEn: string | null; nameFa: string | null; error?: string } {
  const nameFa = str(form, "nameFa") ?? null;
  const nameEn = str(form, "nameEn") ?? null;
  const baseName = nameFa ?? nameEn;
  if (!baseName) {
    return { values: {} as ServiceValues, nameEn, nameFa, error: errs.nameRequired };
  }

  const taglineFa = str(form, "taglineFa") ?? null;
  const taglineEn = str(form, "taglineEn") ?? null;
  const descFa = str(form, "descriptionFa") ?? null;
  const descEn = str(form, "descriptionEn") ?? null;
  const featuresFa = list(form, "featuresFa");
  const featuresEn = list(form, "featuresEn");
  const ctaFa = str(form, "ctaLabelFa") ?? null;
  const ctaEn = str(form, "ctaLabelEn") ?? null;

  const values: ServiceValues = {
    name: baseName,
    tagline: taglineFa ?? taglineEn,
    description: descFa ?? descEn,
    features: featuresFa.length ? featuresFa : featuresEn,
    ctaLabel: ctaFa ?? ctaEn ?? "Get started",
    nameFa,
    nameEn,
    taglineFa,
    taglineEn,
    descriptionFa: descFa,
    descriptionEn: descEn,
    featuresFa,
    featuresEn,
    ctaLabelFa: ctaFa,
    ctaLabelEn: ctaEn,
    priceCents: parsePriceCents(str(form, "price")),
    currency: str(form, "currency") ?? "USD",
    billingPeriod: str(form, "billingPeriod") ?? null,
    status: oneOf(str(form, "status"), STATUS_OPTIONS, "draft"),
    isFeatured: bool(form, "isFeatured"),
  };
  return { values, nameEn, nameFa };
}

export async function createService(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const { values, nameEn, nameFa, error } = readForm(form, errs);
  if (error) return { error };

  try {
    const base = buildBaseSlug(
      { titleEn: nameEn, titleFa: nameFa, title: values.name },
      "service",
    );
    const slug = await ensureUniqueServiceSlug(base);
    await db.insert(services).values({ ...values, slug });
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function updateService(
  id: number,
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const { values, nameEn, nameFa, error } = readForm(form, errs);
  if (error) return { error };

  try {
    const [existing] = await db
      .select({ slug: services.slug })
      .from(services)
      .where(eq(services.id, id))
      .limit(1);
    const slug = existing?.slug?.trim()
      ? existing.slug
      : await ensureUniqueServiceSlug(
          buildBaseSlug(
            { titleEn: nameEn, titleFa: nameFa, title: values.name },
            "service",
          ),
          id,
        );

    await db
      .update(services)
      .set({ ...values, slug, updatedAt: new Date() })
      .where(eq(services.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function deleteService(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const id = Number(form.get("id"));
  if (Number.isNaN(id)) return { error: errs.invalidId };

  try {
    await db.delete(services).where(eq(services.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return {};
}
