import { weightMap } from "@/lib/planner/options";

/**
 * Deterministic, server-authoritative recommendation engine. Pure (no I/O), so
 * the public wizard can preview the same result the server will store.
 */

export interface PlannerAnswers {
  projectType: string;
  cmsSolutionType?: string | null;
  goals: string[];
  features: string[];
  designLevel?: string | null;
  currentStage?: string | null;
  timeline?: string | null;
  budgetLevel?: string | null;
}

export type Complexity = "low" | "medium" | "high" | "very_high";
export type PlanKey =
  | "landing"
  | "cms"
  | "website"
  | "ecommerce"
  | "dashboard"
  | "custom";

export interface Recommendation {
  score: number; // 0..100
  complexity: Complexity;
  plan: PlanKey;
  timelineKey: "1-2-weeks" | "3-6-weeks" | "6-10-weeks" | "10-plus-weeks";
}

const W = {
  projectType: weightMap("projectType"),
  cmsSolutionType: weightMap("cmsSolutionType"),
  goal: weightMap("goal"),
  feature: weightMap("feature"),
  designLevel: weightMap("designLevel"),
  currentStage: weightMap("currentStage"),
  timeline: weightMap("timeline"),
  budgetLevel: weightMap("budgetLevel"),
};

const SCORE_CAP = 42; // raw weight that maps to a 100 score

function complexityFromRaw(raw: number): Complexity {
  if (raw <= 5) return "low";
  if (raw <= 12) return "medium";
  if (raw <= 22) return "high";
  return "very_high";
}

function timelineFor(c: Complexity): Recommendation["timelineKey"] {
  switch (c) {
    case "low":
      return "1-2-weeks";
    case "medium":
      return "3-6-weeks";
    case "high":
      return "6-10-weeks";
    default:
      return "10-plus-weeks";
  }
}

function planFor(a: PlannerAnswers, complexity: Complexity): PlanKey {
  // Advanced WordPress needs → custom development, not "simple WordPress".
  if (a.cmsSolutionType === "advanced_platform") return "custom";
  if (a.projectType === "cms_wordpress") return "cms";
  if (a.projectType === "marketplace") return "custom";
  if (complexity === "very_high") return "custom";
  switch (a.projectType) {
    case "landing_page":
      return "landing";
    case "corporate_website":
    case "personal_branding":
      return "website";
    case "ecommerce":
      return "ecommerce";
    case "admin_dashboard":
      return "dashboard";
    case "custom_web_app":
      return "custom";
    default:
      return "website";
  }
}

/** Compute the recommendation for a set of answers. */
export function recommend(a: PlannerAnswers): Recommendation {
  let raw = 0;
  raw += W.projectType[a.projectType] ?? 0;
  if (a.projectType === "cms_wordpress" && a.cmsSolutionType) {
    raw += W.cmsSolutionType[a.cmsSolutionType] ?? 0;
  }
  for (const g of a.goals) raw += W.goal[g] ?? 0;
  for (const f of a.features) raw += W.feature[f] ?? 0;
  if (a.designLevel) raw += W.designLevel[a.designLevel] ?? 0;
  if (a.currentStage) raw += W.currentStage[a.currentStage] ?? 0;
  if (a.timeline) raw += W.timeline[a.timeline] ?? 0;
  if (a.budgetLevel) raw += W.budgetLevel[a.budgetLevel] ?? 0;

  let complexity = complexityFromRaw(raw);
  // Advanced platform always implies at least high complexity.
  if (a.cmsSolutionType === "advanced_platform" && complexity === "medium") {
    complexity = "high";
  }

  const score = Math.min(100, Math.round((raw / SCORE_CAP) * 100));
  return {
    score,
    complexity,
    plan: planFor(a, complexity),
    timelineKey: timelineFor(complexity),
  };
}
