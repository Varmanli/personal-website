import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { recordPageView } from "@/lib/analytics";

/**
 * POST /api/track — records an anonymous page view.
 *
 * A stable, opaque `vid` is kept in an httpOnly cookie (no personal data). New
 * visitors get one minted here; returning visitors reuse it, so unique-visitor
 * counts are stable across refreshes. Always returns 200 so a failure here can
 * never surface to visitors.
 */

export const runtime = "nodejs";

const VISITOR_COOKIE = "vid";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function clean(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = clean(body.path, 512) ?? "/";
    const referrer = clean(body.referrer, 512);

    const existing = request.cookies.get(VISITOR_COOKIE)?.value;
    const visitorId = existing ?? randomUUID();

    await recordPageView({ visitorId, path, referrer });

    const res = NextResponse.json({ ok: true });
    if (!existing) {
      res.cookies.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: ONE_YEAR_SECONDS,
      });
    }
    return res;
  } catch {
    return NextResponse.json({ ok: false });
  }
}
