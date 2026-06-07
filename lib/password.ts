import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Password hashing with scrypt (node:crypto only — no dependencies).
 * Stored format: "salt:hash" (both hex). Kept separate from lib/auth so it
 * can be imported by standalone scripts without pulling in next/headers.
 */

const SCRYPT_KEYLEN = 64;

/** Hash a plain password into a storable "salt:hash" string. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `${salt}:${hash}`;
}

/** Verify a plain password against a stored "salt:hash" string. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, SCRYPT_KEYLEN);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}
