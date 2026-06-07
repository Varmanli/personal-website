"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { getCurrentAdmin } from "@/lib/auth";
import { type ActionState, oneOf } from "@/lib/form";
import { getAdminErrors, toActionError } from "@/lib/actions/shared";

const MESSAGE_STATUSES = ["new", "read", "archived"] as const;

/** Update a message's status (mark read / archive / reopen). */
export async function updateMessageStatus(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const id = Number(form.get("id"));
  if (Number.isNaN(id)) return { error: errs.invalidId };
  const status = oneOf(
    form.get("status")?.toString(),
    MESSAGE_STATUSES,
    "read",
  );

  try {
    await db
      .update(contactMessages)
      .set({ status, updatedAt: new Date() })
      .where(eq(contactMessages.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return {};
}

/** Permanently delete a message. */
export async function deleteMessage(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  const errs = await getAdminErrors();
  if (!admin) return { error: errs.notSignedIn };

  const id = Number(form.get("id"));
  if (Number.isNaN(id)) return { error: errs.invalidId };

  try {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  } catch (e) {
    return toActionError(e, errs);
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return {};
}
