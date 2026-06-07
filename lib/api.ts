import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { getCurrentAdmin, type AdminSession } from "@/lib/auth";

/** Build a successful JSON API response. */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>({ ok: true, data }, { status });
}

/** Build an error JSON API response. */
export function apiError(error: string, status = 400) {
  return NextResponse.json<ApiResponse<never>>({ ok: false, error }, { status });
}

/**
 * Guard for admin-only API routes.
 * Returns the authenticated admin, or a ready-to-return 401 response.
 *
 * Usage:
 *   const auth = await requireAdmin();
 *   if (!auth.ok) return auth.response;
 *   // auth.admin is available here
 */
export async function requireAdmin(): Promise<
  { ok: true; admin: AdminSession } | { ok: false; response: NextResponse }
> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { ok: false, response: apiError("Unauthorized", 401) };
  }
  return { ok: true, admin };
}
