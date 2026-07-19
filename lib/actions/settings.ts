"use server";

import { revalidatePath } from "next/cache";
import { type NewSiteSettings } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";
import { type ActionState, list, str } from "@/lib/form";
import { getAdminErrors, toActionError } from "@/lib/actions/shared";
import {
  readSiteSettingsRow,
  saveSiteSettings,
} from "@/lib/site-settings";
import {
  deleteStoredUploadFile,
  normalizeStoredAssetUrl,
} from "@/lib/uploads";
import { normalizeWebsiteMode } from "@/lib/website-mode-config";

type PersistedSettingsAssets = Pick<
  NewSiteSettings,
  "avatarUrl" | "resumeUrl" | "logoUrl" | "faviconUrl" | "heroImageUrl"
>;

export type SettingsActionState = ActionState & {
  success?: string;
  persisted?: PersistedSettingsAssets;
};

/**
 * Create or update the single site-settings/profile row (bilingual).
 * If no row exists yet, one is created.
 */
export async function updateSettings(
  _prev: SettingsActionState,
  form: FormData,
): Promise<SettingsActionState> {
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
  const websiteMode = normalizeWebsiteMode(str(form, "websiteMode"));

  const values: Omit<NewSiteSettings, "socialLinks"> = {
    websiteMode,
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
    avatarUrl: normalizeStoredAssetUrl(str(form, "avatarUrl")) ?? null,
    resumeUrl: normalizeStoredAssetUrl(str(form, "resumeUrl")) ?? null,
    logoUrl: normalizeStoredAssetUrl(str(form, "logoUrl")) ?? null,
    faviconUrl: normalizeStoredAssetUrl(str(form, "faviconUrl")) ?? null,
    heroImageUrl: normalizeStoredAssetUrl(str(form, "heroImageUrl")) ?? null,
  };
  const submittedAssets = [
    values.avatarUrl,
    values.resumeUrl,
    values.logoUrl,
    values.faviconUrl,
    values.heroImageUrl,
  ];

  let existingAssets: PersistedSettingsAssets | null = null;
  try {
    const existing = await readSiteSettingsRow();
    if (existing) {
      existingAssets = {
        avatarUrl: existing.avatarUrl,
        resumeUrl: existing.resumeUrl,
        logoUrl: existing.logoUrl,
        faviconUrl: existing.faviconUrl,
        heroImageUrl: existing.heroImageUrl,
      };
    }

    const saved = await saveSiteSettings(values);

    if (existingAssets) {
      const replacements: Array<[string | null | undefined, string | null | undefined]> = [
        [existingAssets.avatarUrl, saved.avatarUrl],
        [existingAssets.resumeUrl, saved.resumeUrl],
        [existingAssets.logoUrl, saved.logoUrl],
        [existingAssets.faviconUrl, saved.faviconUrl],
        [existingAssets.heroImageUrl, saved.heroImageUrl],
      ];
      await Promise.all(
        replacements
          .filter(([prev, next]) => Boolean(prev) && prev !== next)
          .map(([prev]) => deleteStoredUploadFile(prev).catch(() => undefined)),
      );
    }

    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return {
      success: "saved",
      persisted: {
        avatarUrl: saved.avatarUrl,
        resumeUrl: saved.resumeUrl,
        logoUrl: saved.logoUrl,
        faviconUrl: saved.faviconUrl,
        heroImageUrl: saved.heroImageUrl,
      },
    };
  } catch (e) {
    const maybeNewUploads =
      existingAssets == null
        ? submittedAssets
        : [
            values.avatarUrl !== existingAssets.avatarUrl ? values.avatarUrl : null,
            values.resumeUrl !== existingAssets.resumeUrl ? values.resumeUrl : null,
            values.logoUrl !== existingAssets.logoUrl ? values.logoUrl : null,
            values.faviconUrl !== existingAssets.faviconUrl ? values.faviconUrl : null,
            values.heroImageUrl !== existingAssets.heroImageUrl ? values.heroImageUrl : null,
          ];
    await Promise.all(
      maybeNewUploads
        .filter((value): value is string => typeof value === "string")
        .filter(Boolean)
        .map((value) => deleteStoredUploadFile(value).catch(() => undefined)),
    );
    return {
      ...toActionError(e, errs),
      ...(existingAssets
        ? { persisted: existingAssets }
        : null),
    };
  }
}
