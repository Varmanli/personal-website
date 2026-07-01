import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { apiSuccess, apiError } from "@/lib/api";
import type { ContactFormPayload } from "@/types";

/** Minimal email shape check — keep it permissive. */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * POST /api/contact
 * Stores a contact message submitted from the public form.
 */
export async function POST(request: Request) {
  let body: Partial<ContactFormPayload>;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body");
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();
  const subject = body.subject?.trim() || null;
  const projectType = body.projectType?.trim() || null;
  const budgetRange = body.budgetRange?.trim() || null;
  const timeline = body.timeline?.trim() || null;

  if (!name || !email || !message) {
    return apiError("Name, email, and message are required.");
  }
  if (!isValidEmail(email)) {
    return apiError("Please provide a valid email address.");
  }

  try {
    const [row] = await db
      .insert(contactMessages)
      .values({
        name,
        email,
        subject,
        message,
        projectType,
        budgetRange,
        timeline,
      })
      .returning();
    return apiSuccess(row, 201);
  } catch (error) {
    // Never silently drop a submission: if the insert fails (e.g. the database
    // is unavailable), surface a 500 so the form shows a clear error and the
    // visitor knows to try again.
    console.error("[contact] Failed to store message:", error);
    return apiError(
      "We couldn't send your message right now. Please try again later or email me directly.",
      500,
    );
  }
}
