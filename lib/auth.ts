import { timingSafeEqual, createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { verifyPassword } from "@/lib/password";

export { hashPassword, verifyPassword } from "@/lib/password";

/**
 * Authentication core (no external dependencies — uses node:crypto).
 *
 *  - Passwords: scrypt with a per-user random salt, stored as "salt:hash".
 *  - Sessions: a stateless, HMAC-signed cookie token ("payload.signature"),
 *    httpOnly + secure, verified on every request.
 */

const SESSION_COOKIE = "admin_session";
const DAY = 60 * 60 * 24;
const DEFAULT_MAX_AGE = DAY; // 1 day
const REMEMBER_MAX_AGE = DAY * 30; // 30 days

/** The authenticated admin shape exposed to the app (no password hash). */
export interface AdminSession {
  id: number;
  email: string;
  name: string | null;
}

let warnedSecret = false;
function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length > 0) return secret;
  if (!warnedSecret) {
    warnedSecret = true;
    console.warn(
      "[auth] AUTH_SECRET is not set — using an insecure development fallback. " +
        "Set AUTH_SECRET in your environment before deploying.",
    );
  }
  return "dev-insecure-secret-change-me";
}

/* ---------------------------------- Tokens ----------------------------------- */

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(payload: string): string {
  return base64url(createHmac("sha256", getSecret()).update(payload).digest());
}

/** Create a signed session token for a user id, valid for `maxAge` seconds. */
function createToken(userId: number, maxAgeSeconds: number): string {
  const exp = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const payload = base64url(JSON.stringify({ sub: userId, exp }));
  return `${payload}.${sign(payload)}`;
}

/** Verify a token; returns the user id when valid and unexpired, else null. */
function verifyToken(token: string | undefined): number | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSig = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64").toString()) as {
      sub: number;
      exp: number;
    };
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    return data.sub;
  } catch {
    return null;
  }
}

/* --------------------------------- Sessions ---------------------------------- */

/** Issue a session cookie for the given user. */
export async function createSession(userId: number, remember = false) {
  const maxAge = remember ? REMEMBER_MAX_AGE : DEFAULT_MAX_AGE;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createToken(userId, maxAge), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

/** Clear the session cookie (logout). */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Resolve the current admin from the session cookie, or null.
 * Returns null (never throws) when logged out or the DB is unreachable.
 */
export async function getCurrentAdmin(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const userId = verifyToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (userId == null) return null;

  try {
    const [user] = await db
      .select({
        id: adminUsers.id,
        email: adminUsers.email,
        name: adminUsers.name,
      })
      .from(adminUsers)
      .where(eq(adminUsers.id, userId))
      .limit(1);
    return user ?? null;
  } catch (error) {
    console.error("[auth] Failed to load admin user:", error);
    return null;
  }
}

/** Validate credentials; returns the admin on success, else null. */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<AdminSession | null> {
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.toLowerCase()))
    .limit(1);
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return { id: user.id, email: user.email, name: user.name };
}
