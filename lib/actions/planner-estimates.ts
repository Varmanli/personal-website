"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { plannerEstimateRules, plannerSettings } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";
import { type ActionState, bool, str } from "@/lib/form";
import { getAdminErrors, toActionError } from "@/lib/actions/shared";
import {
  DEFAULT_ESTIMATE_RULES,
  DEFAULT_PLANNER_SETTINGS,
} from "@/lib/planner/estimate-rules";

function intOf(form: FormData, key: string, fallback = 0): number {
  const n = Number(form.get(key));
  return Number.isFinite(n) ? Math.round(n) : fallback;
}
function floatOf(form: FormData, key: string, fallback = 0): number {
  const n = Number(form.get(key));
  return Number.isFinite(n) ? n : fallback;
}

const ROUNDING = new Set(["nearest_500k", "nearest_1m"]);

/** Create/update the single planner settings row. */
export async function updatePlannerSettings(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const rounding = str(form, "priceRounding") ?? "nearest_1m";
  const minRaw = str(form, "minimumProjectPrice");
  const values = {
    weeklyRate: intOf(form, "weeklyRate", DEFAULT_PLANNER_SETTINGS.weeklyRate),
    currency: str(form, "currency") ?? DEFAULT_PLANNER_SETTINGS.currency,
    minimumProjectPrice: minRaw ? intOf(form, "minimumProjectPrice") : null,
    priceRounding: ROUNDING.has(rounding) ? rounding : "nearest_1m",
    isEstimateEnabled: form.has("isEstimateEnabled")
      ? bool(form, "isEstimateEnabled")
      : true,
    showPriceToUser: form.has("showPriceToUser")
      ? bool(form, "showPriceToUser")
      : true,
  };

  try {
    const [existing] = await db
      .select({ id: plannerSettings.id })
      .from(plannerSettings)
      .limit(1);
    if (existing) {
      await db
        .update(plannerSettings)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(plannerSettings.id, existing.id));
    } else {
      await db.insert(plannerSettings).values(values);
    }
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/planner-estimates");
  revalidatePath("/start-project");
  return {};
}

/** Seed default estimate rules + settings into the DB from code fallback. */
export async function seedDefaultEstimateRules(
  _prev: ActionState,
  _form: FormData,
): Promise<ActionState> {
  void _form;
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  try {
    await db
      .insert(plannerEstimateRules)
      .values(
        DEFAULT_ESTIMATE_RULES.map((r) => ({
          key: r.key,
          group: r.group,
          labelFa: r.labelFa,
          labelEn: r.labelEn,
          durationDays: r.durationDays,
        })),
      )
      .onConflictDoNothing();

    const [existing] = await db
      .select({ id: plannerSettings.id })
      .from(plannerSettings)
      .limit(1);
    if (!existing) {
      await db.insert(plannerSettings).values({ ...DEFAULT_PLANNER_SETTINGS });
    }
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/planner-estimates");
  return {};
}

/** Update a single estimate rule (key is immutable). */
export async function updateEstimateRule(
  id: number,
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  try {
    await db
      .update(plannerEstimateRules)
      .set({
        labelFa: str(form, "labelFa") ?? null,
        labelEn: str(form, "labelEn") ?? null,
        descriptionFa: str(form, "descriptionFa") ?? null,
        descriptionEn: str(form, "descriptionEn") ?? null,
        durationDays: floatOf(form, "durationDays"),
        sortOrder: intOf(form, "sortOrder"),
        isActive: form.has("isActive") ? bool(form, "isActive") : true,
        updatedAt: new Date(),
      })
      .where(eq(plannerEstimateRules.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/planner-estimates");
  redirect("/admin/planner-estimates");
}

export async function toggleEstimateRule(
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
      .update(plannerEstimateRules)
      .set({ isActive: bool(form, "isActive"), updatedAt: new Date() })
      .where(eq(plannerEstimateRules.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/planner-estimates");
  return {};
}
