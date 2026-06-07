import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  plannerOptions,
  projectRequests,
  plannerEstimateRules,
  plannerSettings,
} from "@/db/schema";
import type {
  PlannerOption,
  ProjectRequest,
  PlannerEstimateRule,
  PlannerSettings,
} from "@/types";
import {
  DEFAULT_ESTIMATE_RULES,
  DEFAULT_PLANNER_SETTINGS,
} from "@/lib/planner/estimate-rules";
import type {
  EstimateRuleLite,
  EstimateSettingsLite,
} from "@/lib/planner/estimate";
import type { Locale } from "@/lib/i18n/config";
import { defaultLocale } from "@/lib/i18n/config";
import {
  PLANNER_GROUPS,
  fallbackOptions,
  localizeOptionDef,
  type LocalizedOption,
  type PlannerGroup,
} from "@/lib/planner/options";

/**
 * Planner data access. Option reads prefer the DB (`planner_options`) per group
 * and fall back to code defaults when a group has no active rows or the DB is
 * unreachable — so the public planner always works.
 */

export type PlannerOptionMap = Record<PlannerGroup, LocalizedOption[]>;

function localizeRow(row: PlannerOption, locale: Locale): LocalizedOption {
  const label =
    locale === "fa"
      ? row.labelFa || row.labelEn || row.value
      : row.labelEn || row.labelFa || row.value;
  const description =
    locale === "fa"
      ? (row.descriptionFa ?? undefined)
      : (row.descriptionEn ?? undefined);
  return { value: row.value, label, description, icon: row.icon, weight: row.weight };
}

/** Localized, active option sets for the public planner (DB-or-fallback). */
export async function getPublicPlannerOptions(
  locale: Locale = defaultLocale,
): Promise<PlannerOptionMap> {
  let rows: PlannerOption[] = [];
  try {
    rows = await db
      .select()
      .from(plannerOptions)
      .where(eq(plannerOptions.isActive, true))
      .orderBy(plannerOptions.sortOrder);
  } catch {
    rows = [];
  }

  const result = {} as PlannerOptionMap;
  for (const group of PLANNER_GROUPS) {
    const dbRows = rows.filter((r) => r.group === group);
    result[group] = dbRows.length
      ? dbRows.map((r) => localizeRow(r, locale))
      : fallbackOptions(group).map((o) => localizeOptionDef(o, locale));
  }
  return result;
}

/** All planner option rows (admin), grouped, ordered by group + sortOrder. */
export async function getAllPlannerOptions(): Promise<PlannerOption[]> {
  try {
    return await db
      .select()
      .from(plannerOptions)
      .orderBy(plannerOptions.group, plannerOptions.sortOrder);
  } catch {
    return [];
  }
}

export async function getPlannerOptionById(
  id: number,
): Promise<PlannerOption | null> {
  try {
    const [row] = await db
      .select()
      .from(plannerOptions)
      .where(eq(plannerOptions.id, id))
      .limit(1);
    return row ?? null;
  } catch {
    return null;
  }
}

/* ------------------------------- Project requests --------------------------- */

export async function getProjectRequests(): Promise<ProjectRequest[]> {
  try {
    return await db
      .select()
      .from(projectRequests)
      .orderBy(desc(projectRequests.createdAt));
  } catch {
    return [];
  }
}

export async function getProjectRequestById(
  id: number,
): Promise<ProjectRequest | null> {
  try {
    const [row] = await db
      .select()
      .from(projectRequests)
      .where(eq(projectRequests.id, id))
      .limit(1);
    return row ?? null;
  } catch {
    return null;
  }
}

/* ------------------------------- Estimate rules ----------------------------- */

/** Active estimate rules for calculation (DB-or-fallback). */
export async function getEstimateRules(): Promise<EstimateRuleLite[]> {
  let rows: PlannerEstimateRule[] = [];
  try {
    rows = await db
      .select()
      .from(plannerEstimateRules)
      .where(eq(plannerEstimateRules.isActive, true));
  } catch {
    rows = [];
  }
  if (rows.length === 0) {
    return DEFAULT_ESTIMATE_RULES.map((r) => ({
      key: r.key,
      durationDays: r.durationDays,
      labelFa: r.labelFa,
      labelEn: r.labelEn,
    }));
  }
  return rows.map((r) => ({
    key: r.key,
    durationDays: r.durationDays,
    labelFa: r.labelFa ?? r.key,
    labelEn: r.labelEn ?? r.key,
  }));
}

/** Planner settings for calculation (DB-or-fallback). */
export async function getPlannerSettings(): Promise<EstimateSettingsLite> {
  try {
    const [row] = await db.select().from(plannerSettings).limit(1);
    if (row) {
      return {
        weeklyRate: row.weeklyRate,
        currency: row.currency,
        minimumProjectPrice: row.minimumProjectPrice,
        priceRounding: row.priceRounding,
        isEstimateEnabled: row.isEstimateEnabled,
        showPriceToUser: row.showPriceToUser,
      };
    }
  } catch {
    /* fall through */
  }
  return { ...DEFAULT_PLANNER_SETTINGS };
}

/** All estimate rules (admin), grouped/ordered. */
export async function getAllEstimateRules(): Promise<PlannerEstimateRule[]> {
  try {
    return await db
      .select()
      .from(plannerEstimateRules)
      .orderBy(plannerEstimateRules.group, plannerEstimateRules.sortOrder);
  } catch {
    return [];
  }
}

export async function getEstimateRuleById(
  id: number,
): Promise<PlannerEstimateRule | null> {
  try {
    const [row] = await db
      .select()
      .from(plannerEstimateRules)
      .where(eq(plannerEstimateRules.id, id))
      .limit(1);
    return row ?? null;
  } catch {
    return null;
  }
}

/** Raw planner settings row for the admin form (null if none). */
export async function getRawPlannerSettings(): Promise<PlannerSettings | null> {
  try {
    const [row] = await db.select().from(plannerSettings).limit(1);
    return row ?? null;
  } catch {
    return null;
  }
}

export interface ProjectRequestStats {
  total: number;
  new: number;
  contacted: number;
  converted: number;
}

export async function getProjectRequestStats(): Promise<ProjectRequestStats> {
  const rows = await getProjectRequests();
  return {
    total: rows.length,
    new: rows.filter((r) => r.status === "new").length,
    contacted: rows.filter((r) => r.status === "contacted").length,
    converted: rows.filter((r) => r.status === "converted").length,
  };
}
