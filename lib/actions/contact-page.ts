"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  siteSettings,
  type ContactPageContent,
  type ContactSettings,
} from "@/db/schema";
import { db } from "@/db";
import { getCurrentAdmin } from "@/lib/auth";
import { normalizeContactPageContent, normalizeContactSettings } from "@/lib/contact-page";
import { getAdminErrors, toActionError } from "@/lib/actions/shared";
import type { ActionState } from "@/lib/form";

function trim(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidHref(href: string): boolean {
  return href.startsWith("/") || /^https?:\/\//i.test(href);
}

function isEmptyContent(content: ContactPageContent): boolean {
  return ![
    content.hero.badge,
    content.hero.title,
    content.hero.subtitle,
    content.hero.supportingText,
    content.infoCard.title,
    content.infoCard.primaryCta.label,
    content.infoCard.primaryCta.href,
    content.infoCard.secondaryCta.label,
    content.infoCard.secondaryCta.href,
    content.processSection.badge,
    content.processSection.title,
    content.processSection.subtitle,
    content.cta.title,
    content.cta.subtitle,
    content.cta.primaryCta.label,
    content.cta.primaryCta.href,
    content.cta.secondaryCta.label,
    content.cta.secondaryCta.href,
    ...content.infoCard.items.flatMap((item) => [
      item.title,
      item.description,
      item.icon ?? "",
    ]),
    ...content.processSection.steps.flatMap((item) => [
      item.title,
      item.description,
      item.icon ?? "",
    ]),
  ].some(Boolean);
}

function hasCoreFields(content: ContactPageContent): boolean {
  return Boolean(
    content.hero.badge &&
      content.hero.title &&
      content.hero.subtitle &&
      content.hero.supportingText &&
      content.infoCard.title &&
      content.infoCard.primaryCta.label &&
      content.infoCard.primaryCta.href &&
      content.infoCard.secondaryCta.label &&
      content.infoCard.secondaryCta.href &&
      content.processSection.badge &&
      content.processSection.title &&
      content.processSection.subtitle &&
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
): { value: ContactPageContent | null; error?: string } {
  const raw = form.get(key);
  if (typeof raw !== "string" || !raw.trim()) return { value: null };

  try {
    const parsed = normalizeContactPageContent(
      JSON.parse(raw) as ContactPageContent,
    );
    if (isEmptyContent(parsed)) return { value: null };
    if (!hasCoreFields(parsed)) return { value: null, error: key };

    const hrefs = [
      parsed.infoCard.primaryCta.href,
      parsed.infoCard.secondaryCta.href,
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

function readContactSettings(form: FormData): ContactSettings | null {
  return normalizeContactSettings({
    phone: trim(form.get("contactPhone")) || undefined,
    telegram: trim(form.get("contactTelegram")) || undefined,
    whatsapp: trim(form.get("contactWhatsapp")) || undefined,
    github: trim(form.get("contactGithub")) || undefined,
    linkedin: trim(form.get("contactLinkedin")) || undefined,
    instagram: trim(form.get("contactInstagram")) || undefined,
    twitter: trim(form.get("contactTwitter")) || undefined,
    dribbble: trim(form.get("contactDribbble")) || undefined,
    behance: trim(form.get("contactBehance")) || undefined,
  });
}

export async function updateContactPageContent(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const fa = parseContentField(form, "contactPageContentFa");
  const en = parseContentField(form, "contactPageContentEn");

  if (fa.error || en.error) {
    const hrefError = fa.error?.endsWith(":href") || en.error?.endsWith(":href");
    return {
      error: hrefError ? errs.invalidUrl : errs.invalidContactContent,
      fieldErrors: {
        ...(fa.error
          ? {
              contactPageContentFa: hrefError
                ? errs.invalidUrl
                : errs.invalidContactContent,
            }
          : {}),
        ...(en.error
          ? {
              contactPageContentEn: hrefError
                ? errs.invalidUrl
                : errs.invalidContactContent,
            }
          : {}),
      },
    };
  }

  const baseContent = fa.value ?? en.value;
  if (!baseContent) return { error: errs.invalidContactContent };

  const email = trim(form.get("email")) || null;
  const contactSettings = readContactSettings(form);

  try {
    const [existing] = await db
      .select({ id: siteSettings.id, ownerName: siteSettings.ownerName })
      .from(siteSettings)
      .limit(1);

    if (existing) {
      await db
        .update(siteSettings)
        .set({
          email,
          contactSettings,
          contactPageContent: baseContent,
          contactPageContentFa: fa.value,
          contactPageContentEn: en.value,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.id, existing.id));
    } else {
      await db.insert(siteSettings).values({
        ownerName: "Contact page",
        email,
        contactSettings,
        contactPageContent: baseContent,
        contactPageContentFa: fa.value,
        contactPageContentEn: en.value,
      });
    }
  } catch (error) {
    return toActionError(error, errs);
  }

  revalidatePath("/contact");
  revalidatePath("/admin/contact");
  revalidatePath("/");
  redirect("/admin/contact");
}
