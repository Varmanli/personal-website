"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { siteSettings, type AboutPageContent } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";
import { normalizeAboutPageContent } from "@/lib/about-page";
import type { ActionState } from "@/lib/form";
import { getAdminErrors, toActionError } from "@/lib/actions/shared";

function isValidHref(href: string): boolean {
  return href.startsWith("/") || /^https?:\/\//i.test(href);
}

function isEmptyContent(content: AboutPageContent): boolean {
  return ![
    content.hero.badge,
    content.hero.name,
    content.hero.headline,
    content.hero.subtitle,
    content.hero.description,
    content.hero.statusBadge,
    content.hero.primaryCta.label,
    content.hero.primaryCta.href,
    content.hero.secondaryCta.label,
    content.hero.secondaryCta.href,
    content.experienceSection.badge,
    content.experienceSection.title,
    content.experienceSection.subtitle,
    content.technologiesSection.badge,
    content.technologiesSection.title,
    content.technologiesSection.subtitle,
    content.philosophySection.badge,
    content.philosophySection.title,
    content.philosophySection.subtitle,
    content.helpSection.badge,
    content.helpSection.title,
    content.helpSection.subtitle,
    content.cta.badge,
    content.cta.title,
    content.cta.subtitle,
    content.cta.primaryCta.label,
    content.cta.primaryCta.href,
    content.cta.secondaryCta.label,
    content.cta.secondaryCta.href,
    ...content.hero.chips,
    ...content.stats.flatMap((item) => [item.label, item.value, item.description ?? ""]),
    ...content.experienceSection.items.flatMap((item) => [
      item.dateRange,
      item.title,
      item.role ?? "",
      item.description,
      ...item.tags,
    ]),
    ...content.technologiesSection.groups.flatMap((group) => [
      group.title,
      group.description,
      ...group.technologies,
    ]),
    ...content.philosophySection.cards.flatMap((item) => [
      item.title,
      item.description,
      item.icon ?? "",
    ]),
    ...content.helpSection.cards.flatMap((item) => [
      item.title,
      item.description,
      item.icon ?? "",
    ]),
  ].some(Boolean);
}

function hasCoreFields(content: AboutPageContent): boolean {
  return Boolean(
    content.hero.badge &&
      content.hero.name &&
      content.hero.subtitle &&
      content.hero.description &&
      content.hero.primaryCta.label &&
      content.hero.primaryCta.href &&
      content.hero.secondaryCta.label &&
      content.hero.secondaryCta.href &&
      content.experienceSection.badge &&
      content.experienceSection.title &&
      content.technologiesSection.badge &&
      content.technologiesSection.title &&
      content.philosophySection.badge &&
      content.philosophySection.title &&
      content.helpSection.badge &&
      content.helpSection.title &&
      content.cta.badge &&
      content.cta.title &&
      content.cta.subtitle &&
      content.cta.primaryCta.label &&
      content.cta.primaryCta.href &&
      content.cta.secondaryCta.label &&
      content.cta.secondaryCta.href,
  );
}

function parseContentField(
  form: FormData,
  key: string,
): { value: AboutPageContent | null; error?: string } {
  const raw = form.get(key);
  if (typeof raw !== "string" || !raw.trim()) return { value: null };

  try {
    const parsed = normalizeAboutPageContent(JSON.parse(raw) as AboutPageContent);
    if (isEmptyContent(parsed)) return { value: null };
    if (!hasCoreFields(parsed)) return { value: null, error: key };

    const hrefs = [
      parsed.hero.primaryCta.href,
      parsed.hero.secondaryCta.href,
      parsed.cta.primaryCta.href,
      parsed.cta.secondaryCta.href,
    ];
    if (hrefs.some((href) => !isValidHref(href))) {
      return { value: null, error: `${key}:href` };
    }

    return { value: parsed };
  } catch {
    return { value: null, error: key };
  }
}

export async function updateAboutPageContent(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const fa = parseContentField(form, "aboutPageContentFa");
  const en = parseContentField(form, "aboutPageContentEn");

  if (fa.error || en.error) {
    const hrefError = fa.error?.endsWith(":href") || en.error?.endsWith(":href");
    return {
      error: hrefError ? errs.invalidUrl : errs.invalidAboutContent,
      fieldErrors: {
        ...(fa.error ? { aboutPageContentFa: hrefError ? errs.invalidUrl : errs.invalidAboutContent } : {}),
        ...(en.error ? { aboutPageContentEn: hrefError ? errs.invalidUrl : errs.invalidAboutContent } : {}),
      },
    };
  }

  const baseContent = fa.value ?? en.value;
  if (!baseContent) return { error: errs.invalidAboutContent };

  const ownerName =
    fa.value?.hero.name || en.value?.hero.name || "About page";

  try {
    const [existing] = await db
      .select({ id: siteSettings.id })
      .from(siteSettings)
      .limit(1);

    if (existing) {
      await db
        .update(siteSettings)
        .set({
          aboutPageContent: baseContent,
          aboutPageContentFa: fa.value,
          aboutPageContentEn: en.value,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.id, existing.id));
    } else {
      await db.insert(siteSettings).values({
        ownerName,
        aboutPageContent: baseContent,
        aboutPageContentFa: fa.value,
        aboutPageContentEn: en.value,
      });
    }
  } catch (error) {
    return toActionError(error, errs);
  }

  revalidatePath("/about");
  revalidatePath("/admin/about");
  redirect("/admin/about");
}
