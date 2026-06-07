"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { plannerOptions, type NewPlannerOption } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";
import { type ActionState, bool, str } from "@/lib/form";
import { getAdminErrors, toActionError } from "@/lib/actions/shared";
import { PLANNER_GROUPS, type PlannerGroup } from "@/lib/planner/options";
import { slugify } from "@/lib/slug";

function num(form: FormData, key: string): number {
  const n = Number(form.get(key));
  return Number.isFinite(n) ? n : 0;
}

function readForm(form: FormData): {
  values: Omit<NewPlannerOption, "value">;
  value: string;
  group: PlannerGroup | null;
} {
  const group = str(form, "group") as PlannerGroup | undefined;
  const value = slugify(str(form, "value") ?? "");
  const values: Omit<NewPlannerOption, "value"> = {
    group: group ?? "feature",
    labelFa: str(form, "labelFa") ?? null,
    labelEn: str(form, "labelEn") ?? null,
    descriptionFa: str(form, "descriptionFa") ?? null,
    descriptionEn: str(form, "descriptionEn") ?? null,
    icon: str(form, "icon") ?? null,
    weight: num(form, "weight"),
    isActive: form.has("isActive") ? bool(form, "isActive") : true,
    sortOrder: num(form, "sortOrder"),
  };
  return {
    values,
    value,
    group: group && PLANNER_GROUPS.includes(group) ? group : null,
  };
}

export async function createPlannerOption(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const { values, value, group } = readForm(form);
  if (!group) return { error: errs.invalidId };
  if (!value) return { error: errs.slugRequired };

  try {
    await db.insert(plannerOptions).values({ ...values, group, value });
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/planner-options");
  redirect("/admin/planner-options");
}

export async function updatePlannerOption(
  id: number,
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  // `value` and `group` are intentionally NOT updated — submitted requests
  // store the value, so it must stay stable.
  const { values, group } = readForm(form);
  if (!group) return { error: errs.invalidId };

  try {
    await db
      .update(plannerOptions)
      .set({ ...values, group, updatedAt: new Date() })
      .where(eq(plannerOptions.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/planner-options");
  redirect("/admin/planner-options");
}

export async function togglePlannerOption(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const id = Number(form.get("id"));
  if (Number.isNaN(id)) return { error: errs.invalidId };
  const next = bool(form, "isActive");

  try {
    await db
      .update(plannerOptions)
      .set({ isActive: next, updatedAt: new Date() })
      .where(eq(plannerOptions.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/planner-options");
  return {};
}

export async function deletePlannerOption(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const id = Number(form.get("id"));
  if (Number.isNaN(id)) return { error: errs.invalidId };

  try {
    await db.delete(plannerOptions).where(eq(plannerOptions.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/planner-options");
  return {};
}
