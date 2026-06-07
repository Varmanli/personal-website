"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { siteSettings, type NewSiteSettings } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";
import { type ActionState, list, str } from "@/lib/form";
import { getAdminErrors, toActionError } from "@/lib/actions/shared";

/**
 * Create or update the single site-settings/profile row (bilingual).
 * If no row exists yet, one is created.
 */
export async function updateSettings(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const ownerNameFa = str(form, "ownerNameFa") ?? null;
  const ownerNameEn = str(form, "ownerNameEn") ?? null;
  const baseName = ownerNameFa ?? ownerNameEn;
  if (!baseName) return { error: errs.nameRequired };

  const headlineFa = str(form, "headlineFa") ?? null;
  const headlineEn = str(form, "headlineEn") ?? null;
  const bioFa = str(form, "bioFa") ?? null;
  const bioEn = str(form, "bioEn") ?? null;
  const locationFa = str(form, "locationFa") ?? null;
  const locationEn = str(form, "locationEn") ?? null;
  const skillsFa = list(form, "skillsFa");
  const skillsEn = list(form, "skillsEn");
  const aboutIntroFa = str(form, "aboutIntroFa") ?? null;
  const aboutIntroEn = str(form, "aboutIntroEn") ?? null;

  const values: Omit<NewSiteSettings, "socialLinks"> = {
    ownerName: baseName,
    headline: headlineFa ?? headlineEn,
    bio: bioFa ?? bioEn,
    location: locationFa ?? locationEn,
    skills: skillsFa.length ? skillsFa : skillsEn,
    aboutIntro: aboutIntroFa ?? aboutIntroEn,
    ownerNameFa,
    ownerNameEn,
    headlineFa,
    headlineEn,
    bioFa,
    bioEn,
    locationFa,
    locationEn,
    skillsFa,
    skillsEn,
    aboutIntroFa,
    aboutIntroEn,
    email: str(form, "email") ?? null,
    avatarUrl: str(form, "avatarUrl") ?? null,
    resumeUrl: str(form, "resumeUrl") ?? null,
    logoUrl: str(form, "logoUrl") ?? null,
    faviconUrl: str(form, "faviconUrl") ?? null,
    heroImageUrl: str(form, "heroImageUrl") ?? null,
  };

  try {
    const [existing] = await db
      .select({ id: siteSettings.id })
      .from(siteSettings)
      .limit(1);
    if (existing) {
      await db
        .update(siteSettings)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(siteSettings.id, existing.id));
    } else {
      await db.insert(siteSettings).values(values);
    }
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  redirect("/admin/settings");
}
