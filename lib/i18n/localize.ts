import type { Locale } from "@/lib/i18n/config";
import type {
  ProjectChallenge,
  Project,
  Service,
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
function pickArr<T>(
  locale: Locale,
  fa: T[] | null | undefined,
  en: T[] | null | undefined,
  base: T[] | null | undefined,
): T[] {
  const primary = locale === "fa" ? fa : en;
  const secondary = locale === "fa" ? en : fa;
  if (primary && primary.length) return primary;
  if (secondary && secondary.length) return secondary;
  return base ?? [];
}

/** Pick any object field: active locale → other locale → base. */
function pickObj<T>(
  locale: Locale,
  fa: T | null | undefined,
  en: T | null | undefined,
  base: T | null | undefined,
): T | null {
  const primary = locale === "fa" ? fa : en;
  const secondary = locale === "fa" ? en : fa;
  return primary ?? secondary ?? base ?? null;
}

/** Like pickArr but for arrays of objects. */
function pickObjArr<T>(
  locale: Locale,
  fa: T[] | null | undefined,
  en: T[] | null | undefined,
  base: T[] | null | undefined,
): T[] {
  const primary = locale === "fa" ? fa : en;
  const secondary = locale === "fa" ? en : fa;
  if (primary && primary.length) return primary;
  if (secondary && secondary.length) return secondary;
  return base ?? [];
}

function normalizeChallengeItems(
  locale: Locale,
  value: unknown,
): ProjectChallenge[] {
  if (!Array.isArray(value)) return [];

  const normalized: ProjectChallenge[] = [];
  for (const [index, item] of value.entries()) {
    if (typeof item === "string") {
      const description = item.trim();
      if (!description) continue;
      normalized.push({
        title: locale === "fa" ? `چالش ${index + 1}` : `Challenge ${index + 1}`,
        description,
      });
      continue;
    }

    if (!item || typeof item !== "object") continue;
    const title =
      typeof (item as { title?: unknown }).title === "string"
        ? (item as { title: string }).title.trim()
        : "";
    const description =
      typeof (item as { description?: unknown }).description === "string"
        ? (item as { description: string }).description.trim()
        : "";

    if (!title && !description) continue;
    normalized.push({
      title: title || (locale === "fa" ? `چالش ${index + 1}` : `Challenge ${index + 1}`),
      description,
    });
  }

  return normalized.filter((item) => item.description);
}

function parseLegacyChallenges(
  locale: Locale,
  value: string | null | undefined,
): ProjectChallenge[] {
  if (!value?.trim()) return [];

  return value
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk, index) => {
      const [firstLine, ...rest] = chunk.split("\n").map((line) => line.trim());
      const description = rest.join(" ").trim();
      return {
        title:
          firstLine ||
          (locale === "fa" ? `چالش ${index + 1}` : `Challenge ${index + 1}`),
        description: description || firstLine,
      };
    })
    .filter((item) => item.description);
}

/** A project with the localized, normalized `challenges` array attached. */
export type LocalizedProject = Project & { challenges: ProjectChallenge[] };

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
  const normalizedChallenges = normalizeChallengeItems(locale, challengeArr);
  const challenges = normalizedChallenges.length
    ? normalizedChallenges
    : parseLegacyChallenges(locale, legacyChallenge);

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
    solution: null,
    outcome: pick(locale, project.outcomeFa, project.outcomeEn, project.outcome),
    tags: pickArr(locale, project.tagsFa, project.tagsEn, project.tags),
    projectType: pick(
      locale,
      project.projectTypeFa,
      project.projectTypeEn,
      project.projectType,
    ),
    homeMetrics: pickObjArr(
      locale,
      project.homeMetricsFa,
      project.homeMetricsEn,
      project.homeMetrics,
    ),
    technicalHighlights: pickArr(
      locale,
      project.technicalHighlightsFa,
      project.technicalHighlightsEn,
      project.technicalHighlights,
    ),
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
    aboutPageContent: pickObj(
      locale,
      settings.aboutPageContentFa,
      settings.aboutPageContentEn,
      settings.aboutPageContent,
    ),
    contactPageContent: pickObj(
      locale,
      settings.contactPageContentFa,
      settings.contactPageContentEn,
      settings.contactPageContent,
    ),
  };
}
