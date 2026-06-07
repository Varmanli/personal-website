"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { projectRequests, type NewProjectRequest } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";
import { type ActionState, str } from "@/lib/form";
import { getAdminErrors, toActionError } from "@/lib/actions/shared";
import { getI18n } from "@/lib/i18n/server";
import { validValues } from "@/lib/planner/options";
import { recommend } from "@/lib/planner/recommend";
import { calculateProjectEstimate } from "@/lib/planner/estimate";
import { getEstimateRules, getPlannerSettings } from "@/lib/planner/data";
import type { PlannerAnswerMap } from "@/lib/planner/question-flow";
import { toLocale } from "@/lib/i18n/config";
import {
  REQUEST_STATUSES,
  type RequestStatus,
} from "@/lib/planner/request-status";

export interface PlannerSubmitState {
  ok?: boolean;
  error?: string;
}

function sanitizeSingle(
  value: string | undefined,
  group: Parameters<typeof validValues>[0],
): string | null {
  if (value && validValues(group).has(value)) return value;
  return null;
}

/** Parse the wizard's serialized dynamic answers map. */
function parseAnswers(raw: string | undefined): PlannerAnswerMap {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as PlannerAnswerMap) : {};
  } catch {
    return {};
  }
}

/**
 * Public: create a project request from the planner wizard.
 * Validates server-side, recomputes the recommendation, and stores it.
 */
export async function createProjectRequest(
  _prev: PlannerSubmitState,
  form: FormData,
): Promise<PlannerSubmitState> {
  const { locale, dict } = await getI18n();
  const t = dict.planner.form;

  // Honeypot — silently succeed for bots without writing anything.
  if (str(form, "website")) return { ok: true };

  const name = str(form, "name");
  const email = str(form, "email") ?? null;
  const phone = str(form, "phone") ?? null;
  if (!name) return { error: t.errorRequired };
  if (!email && !phone) return { error: t.errorContact };

  const projectType = str(form, "projectType");
  if (!projectType || !validValues("projectType").has(projectType)) {
    return { error: t.errorProjectType };
  }

  // Dynamic answers from the conditional wizard (keyed by question id).
  const answers = parseAnswers(str(form, "answers"));
  const asStr = (k: string) =>
    typeof answers[k] === "string" ? (answers[k] as string) : undefined;

  const cmsSolutionType =
    projectType === "cms_wordpress" ? (asStr("cmsSolutionType") ?? null) : null;

  // Flatten all multi-select answers for a record of chosen features.
  const featureSet = new Set<string>();
  for (const v of Object.values(answers)) {
    if (Array.isArray(v)) for (const x of v) if (typeof x === "string") featureSet.add(x);
  }
  const features = [...featureSet];

  const designLevel = sanitizeSingle(asStr("design"), "designLevel");
  const currentStage = sanitizeSingle(asStr("currentStage"), "currentStage");
  const timeline = sanitizeSingle(asStr("timeline"), "timeline");
  const budgetLevel = sanitizeSingle(asStr("budgetLevel"), "budgetLevel");
  const preferredContactMethod = sanitizeSingle(
    str(form, "preferredContactMethod"),
    "contactMethod",
  );

  const rec = recommend({
    projectType,
    cmsSolutionType,
    goals: [],
    features,
    designLevel,
    currentStage,
    timeline,
    budgetLevel,
  });

  // Estimate (admin-configurable rules + settings, code fallback).
  const [rules, settings] = await Promise.all([
    getEstimateRules(),
    getPlannerSettings(),
  ]);
  const est = calculateProjectEstimate({ projectType, answers }, rules, settings);

  const values: NewProjectRequest = {
    name,
    email,
    phone,
    companyName: str(form, "companyName") ?? null,
    preferredContactMethod,
    locale: toLocale(str(form, "locale") ?? locale),
    projectType,
    cmsSolutionType,
    goals: [],
    features,
    designLevel,
    currentStage,
    timeline,
    budgetLevel,
    description: str(form, "description") ?? null,
    suggestedPlan: rec.plan,
    estimatedComplexity: rec.complexity,
    estimatedTimeline: rec.timelineKey,
    score: rec.score,
    estimatedDays: est.estimatedDays,
    estimatedWeeks: est.estimatedWeeks,
    estimatedPrice: est.estimatedPrice,
    currency: est.currency,
    weeklyRateSnapshot: settings.weeklyRate,
    estimateBreakdown: est.breakdown,
    dynamicAnswers: answers,
    status: "new",
  };

  try {
    await db.insert(projectRequests).values(values);
  } catch (e) {
    // Never fake success on a real DB failure. Distinguish a missing/outdated
    // schema (needs `npm run db:push`) from a generic failure, and log details
    // server-side without leaking them to the public UI.
    console.error("[planner] createProjectRequest failed:", e);
    return { error: isSchemaError(e) ? t.errorSchema : t.errorGeneric };
  }

  revalidatePath("/admin/project-requests");
  return { ok: true };
}

/** True when the DB error is a missing table/column (schema not migrated). */
function isSchemaError(e: unknown): boolean {
  const code = (e as { code?: string })?.code;
  if (code === "42P01" || code === "42703") return true; // undefined_table/column
  const msg = e instanceof Error ? e.message : String(e);
  return /does not exist/i.test(msg);
}

/* ----------------------------------- Admin ---------------------------------- */

export async function updateProjectRequestStatus(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const id = Number(form.get("id"));
  if (Number.isNaN(id)) return { error: errs.invalidId };
  const status = str(form, "status");
  if (!status || !REQUEST_STATUSES.includes(status as RequestStatus)) {
    return { error: errs.invalidId };
  }

  try {
    await db
      .update(projectRequests)
      .set({ status: status as RequestStatus, updatedAt: new Date() })
      .where(eq(projectRequests.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/project-requests");
  revalidatePath(`/admin/project-requests/${id}`);
  return {};
}

export async function updateProjectRequestAdminNote(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const id = Number(form.get("id"));
  if (Number.isNaN(id)) return { error: errs.invalidId };

  try {
    await db
      .update(projectRequests)
      .set({ adminNote: str(form, "adminNote") ?? null, updatedAt: new Date() })
      .where(eq(projectRequests.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath(`/admin/project-requests/${id}`);
  return {};
}

export async function archiveProjectRequest(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const id = Number(form.get("id"));
  if (Number.isNaN(id)) return { error: errs.invalidId };

  try {
    await db
      .update(projectRequests)
      .set({ status: "archived", updatedAt: new Date() })
      .where(eq(projectRequests.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/project-requests");
  revalidatePath(`/admin/project-requests/${id}`);
  return {};
}

export async function deleteProjectRequest(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const id = Number(form.get("id"));
  if (Number.isNaN(id)) return { error: errs.invalidId };

  try {
    await db.delete(projectRequests).where(eq(projectRequests.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/project-requests");
  return {};
}
