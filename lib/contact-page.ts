import type {
  ContactInfoItem,
  ContactPageContent,
  ContactProcessStep,
  ContactSettings,
  SiteSettings,
} from "@/types";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

function trim(value: string | undefined | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

function cleanInfoItems(
  items: ContactInfoItem[] | undefined | null,
): ContactInfoItem[] {
  return sortByOrder(
    (items ?? [])
      .map((item, index) => ({
        title: trim(item?.title),
        description: trim(item?.description),
        icon: trim(item?.icon) || undefined,
        order: Number.isFinite(item?.order) ? item.order : index,
      }))
      .filter((item) => item.title && item.description),
  );
}

function cleanProcessSteps(
  items: ContactProcessStep[] | undefined | null,
): ContactProcessStep[] {
  return sortByOrder(
    (items ?? [])
      .map((item, index) => ({
        title: trim(item?.title),
        description: trim(item?.description),
        icon: trim(item?.icon) || undefined,
        order: Number.isFinite(item?.order) ? item.order : index,
      }))
      .filter((item) => item.title && item.description),
  );
}

export function normalizeContactPageContent(
  content: ContactPageContent,
): ContactPageContent {
  return {
    hero: {
      badge: trim(content.hero.badge),
      title: trim(content.hero.title),
      subtitle: trim(content.hero.subtitle),
      supportingText: trim(content.hero.supportingText),
    },
    infoCard: {
      title: trim(content.infoCard.title),
      items: cleanInfoItems(content.infoCard.items),
      primaryCta: {
        label: trim(content.infoCard.primaryCta.label),
        href: trim(content.infoCard.primaryCta.href),
      },
      secondaryCta: {
        label: trim(content.infoCard.secondaryCta.label),
        href: trim(content.infoCard.secondaryCta.href),
      },
    },
    processSection: {
      badge: trim(content.processSection.badge),
      title: trim(content.processSection.title),
      subtitle: trim(content.processSection.subtitle),
      steps: cleanProcessSteps(content.processSection.steps),
    },
    cta: {
      title: trim(content.cta.title),
      subtitle: trim(content.cta.subtitle),
      primaryCta: {
        label: trim(content.cta.primaryCta.label),
        href: trim(content.cta.primaryCta.href),
      },
      secondaryCta: {
        label: trim(content.cta.secondaryCta.label),
        href: trim(content.cta.secondaryCta.href),
      },
    },
  };
}

function trimOptional(value: string | undefined | null): string | undefined {
  const normalized = trim(value);
  return normalized || undefined;
}

export function normalizeContactSettings(
  settings: ContactSettings | null | undefined,
): ContactSettings | null {
  const normalized: ContactSettings = {
    phone: trimOptional(settings?.phone),
    telegram: trimOptional(settings?.telegram),
    whatsapp: trimOptional(settings?.whatsapp),
    github: trimOptional(settings?.github),
    linkedin: trimOptional(settings?.linkedin),
    instagram: trimOptional(settings?.instagram),
    twitter: trimOptional(settings?.twitter),
    dribbble: trimOptional(settings?.dribbble),
    behance: trimOptional(settings?.behance),
  };

  return Object.values(normalized).some(Boolean) ? normalized : null;
}

export function getFallbackContactPageContent(
  locale: Locale = defaultLocale,
  _unusedProfile?: SiteSettings | null,
): ContactPageContent {
  void _unusedProfile;
  const dict = getDictionary(locale);
  const t = dict.contact;

  return normalizeContactPageContent({
    hero: {
      badge: t.eyebrow,
      title: t.title,
      subtitle: t.subtitle,
      supportingText: t.supporting,
    },
    infoCard: {
      title: t.infoCard.title,
      items: t.infoCard.items.map((item, index) => ({
        title: item.title,
        description: item.description,
        icon: item.icon,
        order: index,
      })),
      primaryCta: {
        label: t.infoCard.primaryCta.label,
        href: t.infoCard.primaryCta.href,
      },
      secondaryCta: {
        label: t.infoCard.secondaryCta.label,
        href: t.infoCard.secondaryCta.href,
      },
    },
    processSection: {
      badge: t.process.badge,
      title: t.process.title,
      subtitle: t.process.subtitle,
      steps: t.process.steps.map((step, index) => ({
        title: step.title,
        description: step.description,
        icon: step.icon,
        order: index,
      })),
    },
    cta: {
      title: t.cta.title,
      subtitle: t.cta.subtitle,
      primaryCta: {
        label: t.cta.primary,
        href: "/start-project",
      },
      secondaryCta: {
        label: t.cta.secondary,
        href: "/services",
      },
    },
  });
}

export interface ContactLinkEntry {
  key: string;
  label: string;
  value: string;
  href: string;
}

function maybeUrl(value: string | undefined): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return null;
}

function phoneHref(value: string | undefined): string | null {
  if (!value) return null;
  const normalized = value.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : null;
}

function telegramHref(value: string | undefined): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const handle = value.replace(/^@/, "");
  return handle ? `https://t.me/${handle}` : null;
}

function whatsappHref(value: string | undefined): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const digits = value.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export function getContactLinkEntries(
  settings: ContactSettings | null | undefined,
): ContactLinkEntry[] {
  const links: ContactLinkEntry[] = [];
  const add = (key: string, label: string, value: string | undefined, href: string | null) => {
    if (!value || !href) return;
    links.push({ key, label, value, href });
  };

  add("phone", "Phone", settings?.phone, phoneHref(settings?.phone));
  add("telegram", "Telegram", settings?.telegram, telegramHref(settings?.telegram));
  add("whatsapp", "WhatsApp", settings?.whatsapp, whatsappHref(settings?.whatsapp));
  add("github", "GitHub", settings?.github, maybeUrl(settings?.github));
  add("linkedin", "LinkedIn", settings?.linkedin, maybeUrl(settings?.linkedin));
  add("instagram", "Instagram", settings?.instagram, maybeUrl(settings?.instagram));
  add("twitter", "X / Twitter", settings?.twitter, maybeUrl(settings?.twitter));
  add("dribbble", "Dribbble", settings?.dribbble, maybeUrl(settings?.dribbble));
  add("behance", "Behance", settings?.behance, maybeUrl(settings?.behance));

  return links;
}

export function getFooterSocialLinks(
  profile: Pick<SiteSettings, "contactSettings" | "socialLinks">,
): { label: string; url: string }[] {
  const contactLinks = getContactLinkEntries(profile.contactSettings).filter(
    (item) =>
      !["phone", "whatsapp", "telegram"].includes(item.key) ||
      item.key === "telegram" ||
      item.key === "whatsapp",
  );

  if (contactLinks.length > 0) {
    return contactLinks.map((item) => ({ label: item.label, url: item.href }));
  }

  return profile.socialLinks ?? [];
}
