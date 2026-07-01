import type { PlannerAnswerMap } from "@/lib/planner/question-flow";
import type { EstimateBreakdownItem } from "@/types";

/**
 * Project estimator.
 *
 * Produces an approximate, transparent estimate from the smart-brief answers:
 * a base per project type, plus contributions from page count, design level,
 * selected features, content/data complexity, and timeline urgency. The result
 * is a price *range* (never a fixed contract price) with a human-readable
 * breakdown. Pure — shared by the server action and the live wizard preview.
 */

export interface EstimateRuleLite {
  key: string;
  durationDays: number;
  labelFa: string;
  labelEn: string;
}

export interface EstimateSettingsLite {
  weeklyRate: number;
  currency: string;
  minimumProjectPrice: number | null;
  priceRounding: string;
  isEstimateEnabled: boolean;
  showPriceToUser: boolean;
}

export type ComplexityKey = "low" | "medium" | "high" | "needs_review";
export type TimelineKey =
  | "1-2-weeks"
  | "3-6-weeks"
  | "6-10-weeks"
  | "10-plus-weeks";

export interface EstimateResult {
  estimatedDays: number;
  estimatedWeeks: number;
  /** Low end of the range — stored as the canonical `estimatedPrice`. */
  estimatedPrice: number;
  priceLow: number;
  priceHigh: number;
  currency: string;
  complexityKey: ComplexityKey;
  timelineKey: TimelineKey;
  /** True for very large scopes that need manual review (e.g. > 20 pages). */
  needsReview: boolean;
  breakdown: EstimateBreakdownItem[];
}

/* ----------------------------- Internal config ------------------------------ */

interface BaseConfig {
  days: number;
  price: number;
  basePages: number;
}

const BASE: Record<string, BaseConfig> = {
  landing_page: { days: 3, price: 12_000_000, basePages: 1 },
  corporate_website: { days: 6, price: 25_000_000, basePages: 5 },
  personal_branding: { days: 5, price: 20_000_000, basePages: 3 },
  cms_wordpress: { days: 7, price: 28_000_000, basePages: 5 },
  ecommerce: { days: 12, price: 50_000_000, basePages: 6 },
  marketplace: { days: 25, price: 120_000_000, basePages: 8 },
  admin_dashboard: { days: 14, price: 60_000_000, basePages: 6 },
  custom_web_app: { days: 20, price: 90_000_000, basePages: 6 },
};

const DESIGN_MULTIPLIER: Record<string, number> = {
  simple: 1.0,
  professional: 1.25,
  custom: 1.5,
};

/** Per extra page, by design level (standard ≈ 1 working day). */
const PER_PAGE_DAYS: Record<string, number> = {
  simple: 0.6,
  professional: 1.0,
  custom: 1.4,
};

const URGENCY_MULTIPLIER: Record<string, number> = {
  flexible: 1.0,
  "1-2-months": 1.0,
  "3-4-weeks": 1.1,
  "under-3-weeks": 1.2,
  urgent: 1.35,
};

/** Representative mid-point day cost per feature (kept internal). */
const FEATURE_DAYS: Record<string, number> = {
  contact_form: 0.5,
  cms_blog: 3,
  auth: 2.5,
  admin_panel: 6,
  roles: 3,
  payments: 3,
  wallet: 5.5,
  subscription: 4.5,
  upload: 3,
  search: 3.5,
  reporting: 4.5,
  notifications: 3,
  multilingual: 3.5,
  external_api: 4,
  advanced_seo: 3.5,
  performance: 3.5,
};

const CONTENT_DAYS: Record<string, number> = {
  static: 0,
  editable: 2,
  multiple_entities: 5,
  complex_model: 9,
};

// Post-launch support adjusts the price *range*. "ongoing" is a separate
// monthly agreement, so it adds nothing to the project estimate.
const SUPPORT_PRICE_LOW: Record<string, number> = {
  none: 1,
  basic_1_month: 1.05,
  pro_3_months: 1.12,
  ongoing: 1,
};
const SUPPORT_PRICE_HIGH: Record<string, number> = {
  none: 1,
  basic_1_month: 1.08,
  pro_3_months: 1.18,
  ongoing: 1,
};
// Professional support adds a little handover/setup time.
const SUPPORT_DAYS: Record<string, number> = {
  none: 0,
  basic_1_month: 0,
  pro_3_months: 2,
  ongoing: 0,
};

const MAX_REVIEW_PAGES = 20;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function roundPrice(value: number): number {
  // Clean numbers: nearest 1M below 50M, nearest 5M above.
  const step = value >= 50_000_000 ? 5_000_000 : 1_000_000;
  return Math.round(value / step) * step;
}

function timelineForWeeks(weeks: number): TimelineKey {
  if (weeks <= 2) return "1-2-weeks";
  if (weeks <= 6) return "3-6-weeks";
  if (weeks <= 10) return "6-10-weeks";
  return "10-plus-weeks";
}

function emptyResult(currency: string): EstimateResult {
  return {
    estimatedDays: 0,
    estimatedWeeks: 0,
    estimatedPrice: 0,
    priceLow: 0,
    priceHigh: 0,
    currency,
    complexityKey: "low",
    timelineKey: "1-2-weeks",
    needsReview: false,
    breakdown: [],
  };
}

/* -------------------------------- Estimator --------------------------------- */

export function calculateProjectEstimate(
  input: { projectType: string; answers: PlannerAnswerMap },
  settings: EstimateSettingsLite,
): EstimateResult {
  const base = BASE[input.projectType];
  // No meaningful estimate until a project type is chosen.
  if (!base) return emptyResult(settings.currency);

  const a = input.answers;
  const breakdown: EstimateBreakdownItem[] = [];
  const note = (key: string, labelFa: string, labelEn: string, days: number) => {
    if (days <= 0) return;
    breakdown.push({ key, labelFa, labelEn, durationDays: round2(days) });
  };

  const designLevel =
    typeof a.designLevel === "string" && a.designLevel in DESIGN_MULTIPLIER
      ? a.designLevel
      : "simple";
  const designMult = DESIGN_MULTIPLIER[designLevel];
  const perPage = PER_PAGE_DAYS[designLevel];

  // Base
  note("base", "پایه پروژه", "Project base", base.days);

  // Pages — only count pages beyond the type's baseline.
  const pages =
    typeof a.pages === "number" && a.pages > 0 ? Math.min(a.pages, 99) : base.basePages;
  const extraPages = Math.max(0, pages - base.basePages);
  const pageDays = extraPages * perPage;
  note("pages", "صفحات اضافه", "Additional pages", pageDays);

  // Features
  const features = Array.isArray(a.features) ? a.features : [];
  let featureDays = 0;
  for (const f of features) {
    if (typeof f === "string" && FEATURE_DAYS[f] != null) featureDays += FEATURE_DAYS[f];
  }
  note("features", "امکانات انتخاب‌شده", "Selected features", featureDays);

  // Content / data complexity
  const contentNeed = typeof a.contentNeed === "string" ? a.contentNeed : "static";
  const contentDays = CONTENT_DAYS[contentNeed] ?? 0;
  note("content", "محتوا و ساختار داده", "Content & data structure", contentDays);

  const subtotalDays = base.days + pageDays + featureDays + contentDays;
  // Design level scales the whole effort.
  let totalDays = subtotalDays * designMult;
  if (designMult > 1) {
    note(
      "design",
      "سطح طراحی",
      "Design level",
      subtotalDays * (designMult - 1),
    );
  }

  // Post-launch support (handover/setup time for professional plans).
  const support = typeof a.supportPlan === "string" ? a.supportPlan : "none";
  const supportDays = SUPPORT_DAYS[support] ?? 0;
  totalDays += supportDays;
  note("support", "پشتیبانی پس از تحویل", "Post-launch support", supportDays);

  // Round days to nearest 0.5; weeks at 5 working days/week.
  const estimatedDays = Math.round(totalDays * 2) / 2;
  totalDays = estimatedDays;
  const estimatedWeeks = Math.max(0.5, Math.ceil((estimatedDays / 5) * 2) / 2);

  // Price: derive from weekly rate, floored at a scaled base price.
  const timeline = typeof a.timeline === "string" ? a.timeline : "flexible";
  const urgencyMult = URGENCY_MULTIPLIER[timeline] ?? 1;
  const fromRate = settings.weeklyRate * estimatedWeeks;
  let mid = Math.max(fromRate, base.price * designMult);
  mid *= urgencyMult;
  if (settings.minimumProjectPrice && mid < settings.minimumProjectPrice) {
    mid = settings.minimumProjectPrice;
  }
  if (urgencyMult > 1) {
    note("urgency", "زمان‌بندی فشرده", "Compressed timeline", estimatedDays * (urgencyMult - 1) * 0.2);
  }

  const supportLow = SUPPORT_PRICE_LOW[support] ?? 1;
  const supportHigh = SUPPORT_PRICE_HIGH[support] ?? 1;
  const priceLow = roundPrice(mid * supportLow);
  const priceHigh = roundPrice(mid * 1.3 * supportHigh);

  // Complexity label from total effort (kept client-friendly).
  const needsReview = pages > MAX_REVIEW_PAGES || estimatedDays >= 60;
  let complexityKey: ComplexityKey;
  if (needsReview) complexityKey = "needs_review";
  else if (estimatedDays <= 8) complexityKey = "low";
  else if (estimatedDays <= 20) complexityKey = "medium";
  else complexityKey = "high";

  return {
    estimatedDays,
    estimatedWeeks,
    estimatedPrice: priceLow,
    priceLow,
    priceHigh,
    currency: settings.currency,
    complexityKey,
    timelineKey: timelineForWeeks(estimatedWeeks),
    needsReview,
    breakdown,
  };
}
