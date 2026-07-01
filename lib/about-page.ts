import type {
  AboutCardItem,
  AboutPageContent,
  AboutTechnologyGroup,
  SiteSettings,
} from "@/types";
import { getExperience, getTechStack } from "@/lib/content";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

function trim(value: string | undefined | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

function cleanTextArray(items: string[] | undefined | null): string[] {
  return (items ?? []).map(trim).filter(Boolean);
}

function cleanCards(items: AboutCardItem[] | undefined | null): AboutCardItem[] {
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

function cleanGroups(
  groups: AboutTechnologyGroup[] | undefined | null,
): AboutTechnologyGroup[] {
  return sortByOrder(
    (groups ?? [])
      .map((group, index) => ({
        title: trim(group?.title),
        description: trim(group?.description),
        technologies: cleanTextArray(group?.technologies),
        order: Number.isFinite(group?.order) ? group.order : index,
      }))
      .filter((group) => group.title && group.description && group.technologies.length),
  );
}

export function normalizeAboutPageContent(
  content: AboutPageContent,
): AboutPageContent {
  return {
    hero: {
      badge: trim(content.hero.badge),
      name: trim(content.hero.name),
      headline: trim(content.hero.headline) || undefined,
      subtitle: trim(content.hero.subtitle),
      description: trim(content.hero.description),
      imageUrl: trim(content.hero.imageUrl) || undefined,
      statusBadge: trim(content.hero.statusBadge) || undefined,
      chips: cleanTextArray(content.hero.chips),
      primaryCta: {
        label: trim(content.hero.primaryCta.label),
        href: trim(content.hero.primaryCta.href),
      },
      secondaryCta: {
        label: trim(content.hero.secondaryCta.label),
        href: trim(content.hero.secondaryCta.href),
      },
    },
    stats: sortByOrder(
      (content.stats ?? [])
        .map((item, index) => ({
          label: trim(item?.label),
          value: trim(item?.value),
          description: trim(item?.description) || undefined,
          order: Number.isFinite(item?.order) ? item.order : index,
        }))
        .filter((item) => item.label && item.value),
    ),
    experienceSection: {
      badge: trim(content.experienceSection.badge),
      title: trim(content.experienceSection.title),
      subtitle: trim(content.experienceSection.subtitle),
      items: sortByOrder(
        (content.experienceSection.items ?? [])
          .map((item, index) => ({
            dateRange: trim(item?.dateRange),
            title: trim(item?.title),
            role: trim(item?.role) || undefined,
            description: trim(item?.description),
            tags: cleanTextArray(item?.tags),
            order: Number.isFinite(item?.order) ? item.order : index,
          }))
          .filter((item) => item.dateRange && item.title && item.description),
      ),
    },
    technologiesSection: {
      badge: trim(content.technologiesSection.badge),
      title: trim(content.technologiesSection.title),
      subtitle: trim(content.technologiesSection.subtitle),
      groups: cleanGroups(content.technologiesSection.groups),
    },
    philosophySection: {
      badge: trim(content.philosophySection.badge),
      title: trim(content.philosophySection.title),
      subtitle: trim(content.philosophySection.subtitle),
      cards: cleanCards(content.philosophySection.cards),
    },
    helpSection: {
      badge: trim(content.helpSection.badge),
      title: trim(content.helpSection.title),
      subtitle: trim(content.helpSection.subtitle),
      cards: cleanCards(content.helpSection.cards),
    },
    cta: {
      badge: trim(content.cta.badge),
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

export function getFallbackAboutPageContent(
  locale: Locale = defaultLocale,
  profile?: SiteSettings | null,
): AboutPageContent {
  const dict = getDictionary(locale);
  const t = dict.about;
  const experience = getExperience(locale);
  const techStack = getTechStack(locale);

  return normalizeAboutPageContent({
    hero: {
      badge: t.hero.eyebrow,
      name: profile?.ownerName || t.hero.title,
      headline: profile?.headline ?? undefined,
      subtitle: t.hero.subtitle,
      description: t.hero.supporting,
      imageUrl: profile?.avatarUrl ?? undefined,
      statusBadge: t.hero.available,
      chips: t.hero.chips,
      primaryCta: { label: t.hero.primary, href: "/start-project" },
      secondaryCta: { label: t.hero.secondary, href: "/projects" },
    },
    stats: t.stats.items.map((item, index) => ({
      label: item.label,
      value: item.value,
      description: undefined,
      order: index,
    })),
    experienceSection: {
      badge: t.experience.eyebrow,
      title: t.experience.title,
      subtitle: t.experience.subtitle,
      items: experience.map((item, index) => ({
        dateRange: item.period,
        title: item.role,
        role: item.organization,
        description: item.description,
        tags: item.tags ?? [],
        order: index,
      })),
    },
    technologiesSection: {
      badge: t.tools.eyebrow,
      title: t.tools.title,
      subtitle: t.tools.subtitle,
      groups: techStack.map((group, index) => ({
        title: group.category,
        description: group.description ?? "",
        technologies: group.items,
        order: index,
      })),
    },
    philosophySection: {
      badge: t.values.eyebrow,
      title: t.values.title,
      subtitle: t.values.subtitle,
      cards: t.values.items.map((item, index) => ({
        title: item.title,
        description: item.description,
        icon: undefined,
        order: index,
      })),
    },
    helpSection: {
      badge: t.help.eyebrow,
      title: t.help.title,
      subtitle: t.help.subtitle,
      cards: t.help.items.map((item, index) => ({
        title: item.title,
        description: item.description,
        icon: undefined,
        order: index,
      })),
    },
    cta: {
      badge: dict.footer.available,
      title: dict.home.cta.title,
      subtitle: dict.home.cta.description,
      primaryCta: { label: dict.home.cta.cta, href: "/start-project" },
      secondaryCta: { label: dict.home.cta.secondary, href: "/projects" },
    },
  });
}
