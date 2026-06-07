import { randomBytes } from "node:crypto";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

/**
 * ArvanCloud Object Storage (S3-compatible) helper.
 *
 * Server-only — credentials live in env vars and must never reach the browser.
 * The public URL of an object is `${S3_PUBLIC_BASE_URL}/${key}`.
 */

export interface StorageEnv {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string;
}

/**
 * Read + validate the storage environment. Throws a clear error when a var is
 * missing so the API route can fail gracefully with a friendly message.
 */
export function assertStorageEnv(): StorageEnv {
  const env = {
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    publicBaseUrl: process.env.S3_PUBLIC_BASE_URL,
  };

  const missing = Object.entries(env)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length > 0) {
    throw new Error(`Storage is not configured (missing: ${missing.join(", ")})`);
  }

  return env as StorageEnv;
}

let cachedClient: S3Client | null = null;

/** Lazily-created, memoised S3 client for ArvanCloud. */
export function s3Client(): S3Client {
  if (cachedClient) return cachedClient;
  const env = assertStorageEnv();
  cachedClient = new S3Client({
    region: env.region,
    endpoint: env.endpoint,
    // ArvanCloud works with virtual-host style by default. If uploads ever fail
    // with a host/DNS error, flip this to `true` (path-style).
    forcePathStyle: false,
    credentials: {
      accessKeyId: env.accessKeyId,
      secretAccessKey: env.secretAccessKey,
    },
  });
  return cachedClient;
}

/** Build the public URL for a stored object key. */
export function getPublicUrl(key: string): string {
  const base = (process.env.S3_PUBLIC_BASE_URL ?? "").replace(/\/+$/, "");
  const cleanKey = key.replace(/^\/+/, "");
  return `${base}/${cleanKey}`;
}

/**
 * Make a file name safe for use in an object key:
 *  - strip directory separators / traversal (`..`, `/`, `\`)
 *  - keep only a conservative character set
 *  - lowercase, collapse repeats, trim length
 * Returns `{ base, ext }` (ext includes the leading dot, or "").
 */
export function sanitizeFileName(fileName: string): { base: string; ext: string } {
  const justName = (fileName ?? "").split(/[\\/]/).pop() ?? "";
  const dot = justName.lastIndexOf(".");
  const rawBase = dot > 0 ? justName.slice(0, dot) : justName;
  const rawExt = dot > 0 ? justName.slice(dot + 1) : "";

  const base =
    rawBase
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "file";

  const ext = rawExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 8);

  return { base, ext: ext ? `.${ext}` : "" };
}

/**
 * Build a collision-resistant object key under a (server-controlled) folder.
 * Example: `uploads/projects/2026/my-image-1717000000000-a1b2c3.webp`.
 */
export function buildObjectKey(folder: string, fileName: string): string {
  const { base, ext } = sanitizeFileName(fileName);
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const year = new Date().getFullYear();
  const suffix = `${Date.now()}-${randomBytes(4).toString("hex")}`;
  return `${cleanFolder}/${year}/${base}-${suffix}${ext}`;
}

/** Upload a buffer to object storage and return its public URL + key. */
export async function uploadObject(params: {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
}): Promise<{ key: string; url: string }> {
  const env = assertStorageEnv();
  await s3Client().send(
    new PutObjectCommand({
      Bucket: env.bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      ACL: "public-read",
    }),
  );
  return { key: params.key, url: getPublicUrl(params.key) };
}

/** Delete an object by key. Best-effort; never throws to callers that ignore it. */
export async function deleteObject(key: string): Promise<void> {
  const env = assertStorageEnv();
  await s3Client().send(
    new DeleteObjectCommand({ Bucket: env.bucket, Key: key }),
  );
}
