import {
  getQuestionsForProjectType,
  shouldShowQuestion,
  type PlannerAnswerMap,
} from "@/lib/planner/question-flow";
import type { EstimateBreakdownItem } from "@/types";

/**
 * Estimator. Sums duration contributions from matched rules (base + selected
 * options + numeric per-unit answers), converts to weeks, and prices from the
 * weekly rate. Pure — used by the server action and the live wizard preview.
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

export interface EstimateResult {
  estimatedDays: number;
  estimatedWeeks: number;
  estimatedPrice: number;
  currency: string;
  breakdown: EstimateBreakdownItem[];
}

const PER_QUESTION_DAY_CAP = 30;

function roundPrice(value: number, mode: string): number {
  const step = mode === "nearest_500k" ? 500000 : 1000000;
  return Math.round(value / step) * step;
}

export function calculateProjectEstimate(
  input: { projectType: string; answers: PlannerAnswerMap },
  rules: EstimateRuleLite[],
  settings: EstimateSettingsLite,
): EstimateResult {
  const byKey = new Map(rules.map((r) => [r.key, r]));
  const breakdown: EstimateBreakdownItem[] = [];
  let totalDays = 0;

  const add = (key: string, multiplier = 1) => {
    const rule = byKey.get(key);
    if (!rule) return;
    const days = Math.min(rule.durationDays * multiplier, PER_QUESTION_DAY_CAP);
    if (days <= 0) return;
    breakdown.push({
      key: rule.key,
      labelFa: rule.labelFa,
      labelEn: rule.labelEn,
      durationDays: Math.round(days * 100) / 100,
    });
    totalDays += days;
  };

  // Base
  add(`${input.projectType}_base`);

  // Type-specific questions
  const questions = getQuestionsForProjectType(input.projectType).filter((q) =>
    shouldShowQuestion(q, input.answers),
  );
  for (const q of questions) {
    const val = input.answers[q.id];
    if (q.type === "number") {
      const n = typeof val === "number" ? val : Number(val);
      if (q.estimateKey && Number.isFinite(n) && n > 0) add(q.estimateKey, n);
    } else if (q.type === "multi") {
      const arr = Array.isArray(val) ? val : [];
      for (const v of arr) {
        const opt = q.options?.find((o) => o.value === v);
        if (opt?.estimateKey) add(opt.estimateKey);
      }
    } else {
      const opt = q.options?.find((o) => o.value === val);
      if (opt?.estimateKey) add(opt.estimateKey);
    }
  }

  // Round days to nearest 0.5
  const estimatedDays = Math.round(totalDays * 2) / 2;
  // Weeks: 5 working days = 1 week, rounded up to nearest 0.5 week.
  const estimatedWeeks = Math.max(0.5, Math.ceil((estimatedDays / 5) * 2) / 2);

  let estimatedPrice = settings.weeklyRate * estimatedWeeks;
  if (settings.minimumProjectPrice && estimatedPrice < settings.minimumProjectPrice) {
    estimatedPrice = settings.minimumProjectPrice;
  }
  estimatedPrice = roundPrice(estimatedPrice, settings.priceRounding);

  return {
    estimatedDays,
    estimatedWeeks,
    estimatedPrice,
    currency: settings.currency,
    breakdown,
  };
}
