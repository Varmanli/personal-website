import type { Locale } from "@/lib/i18n/config";
import type {
  Project,
  Service,
  PortfolioItem,
  SiteSettings,
} from "@/types";

/**
 * Locale-aware field resolution for bilingual DB content.
 *
 * Strategy: prefer the active locale, then the other locale, then the legacy
 * shared/base field. Localize helpers return the SAME row shape with the base
 * display fields overwritten, so public components keep using `project.title`
 * etc. unchanged.
 */

/** Pick a string field: active locale → other locale → base. */
function pick(
  locale: Locale,
  fa: string | null | undefined,
  en: string | null | undefined,
  base: string | null | undefined,
): string | null {
  const primary = locale === "fa" ? fa : en;
  const secondary = locale === "fa" ? en : fa;
  return primary || secondary || base || null;
}

/** Like `pick` but guarantees a non-empty string (for title/name). */
function pickRequired(
  locale: Locale,
  fa: string | null | undefined,
  en: string | null | undefined,
  base: string,
): string {
  return pick(locale, fa, en, base) || base;
}

/** Pick an array field: first non-empty among active → other → base. */
function pickArr(
  locale: Locale,
  fa: string[] | null | undefined,
  en: string[] | null | undefined,
  base: string[] | null | undefined,
): string[] {
  const primary = locale === "fa" ? fa : en;
  const secondary = locale === "fa" ? en : fa;
  if (primary && primary.length) return primary;
  if (secondary && secondary.length) return secondary;
  return base ?? [];
}

/** A project with the localized, normalized `challenges` array attached. */
export type LocalizedProject = Project & { challenges: string[] };

export function localizeProject(
  project: Project,
  locale: Locale,
): LocalizedProject {
  // Prefer the localized challenges array; fall back to the legacy single
  // challenge field (so old rows still render).
  const challengeArr = pickArr(
    locale,
    project.challengesFa,
    project.challengesEn,
    [],
  );
  const legacyChallenge = pick(
    locale,
    project.challengeFa,
    project.challengeEn,
    project.challenge,
  );
  const challenges = challengeArr.length
    ? challengeArr
    : legacyChallenge
      ? [legacyChallenge]
      : [];

  return {
    ...project,
    challenges,
    title: pickRequired(locale, project.titleFa, project.titleEn, project.title),
    shortDescription: pick(
      locale,
      project.shortDescriptionFa,
      project.shortDescriptionEn,
      project.shortDescription,
    ),
    description: pick(
      locale,
      project.descriptionFa,
      project.descriptionEn,
      project.description,
    ),
    role: pick(locale, project.roleFa, project.roleEn, project.role),
    client: pick(locale, project.clientFa, project.clientEn, project.client),
    challenge: pick(
      locale,
      project.challengeFa,
      project.challengeEn,
      project.challenge,
    ),
    solution: pick(
      locale,
      project.solutionFa,
      project.solutionEn,
      project.solution,
    ),
    outcome: pick(locale, project.outcomeFa, project.outcomeEn, project.outcome),
    tags: pickArr(locale, project.tagsFa, project.tagsEn, project.tags),
  };
}

export function localizeService(service: Service, locale: Locale): Service {
  return {
    ...service,
    name: pickRequired(locale, service.nameFa, service.nameEn, service.name),
    tagline: pick(locale, service.taglineFa, service.taglineEn, service.tagline),
    description: pick(
      locale,
      service.descriptionFa,
      service.descriptionEn,
      service.description,
    ),
    features: pickArr(
      locale,
      service.featuresFa,
      service.featuresEn,
      service.features,
    ),
    ctaLabel: pick(
      locale,
      service.ctaLabelFa,
      service.ctaLabelEn,
      service.ctaLabel,
    ),
  };
}

export function localizePortfolioItem(
  item: PortfolioItem,
  locale: Locale,
): PortfolioItem {
  return {
    ...item,
    title: pickRequired(locale, item.titleFa, item.titleEn, item.title),
    description: pick(
      locale,
      item.descriptionFa,
      item.descriptionEn,
      item.description,
    ),
  };
}

export function localizeProfile(
  settings: SiteSettings,
  locale: Locale,
): SiteSettings {
  return {
    ...settings,
    ownerName: pickRequired(
      locale,
      settings.ownerNameFa,
      settings.ownerNameEn,
      settings.ownerName,
    ),
    headline: pick(
      locale,
      settings.headlineFa,
      settings.headlineEn,
      settings.headline,
    ),
    bio: pick(locale, settings.bioFa, settings.bioEn, settings.bio),
    location: pick(
      locale,
      settings.locationFa,
      settings.locationEn,
      settings.location,
    ),
    skills: pickArr(locale, settings.skillsFa, settings.skillsEn, settings.skills),
    aboutIntro: pick(
      locale,
      settings.aboutIntroFa,
      settings.aboutIntroEn,
      settings.aboutIntro,
    ),
  };
}
