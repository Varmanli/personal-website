import { randomBytes } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_UPLOAD_DIR = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  "uploads",
);
const DEFAULT_UPLOAD_BASE_URL = "/uploads";

export interface UploadFileResult {
  key: string;
  url: string;
  absolutePath: string;
}

function stripLeadingSlashes(value: string): string {
  return value.replace(/^\/+/, "");
}

function stripLegacyUploadPrefixes(value: string): string {
  return stripLeadingSlashes(value)
    .replace(/^public\/+/i, "")
    .replace(/^uploads\/+/i, "");
}

export function getUploadDir(): string {
  const configured = process.env.UPLOAD_DIR?.trim();
  if (!configured) return DEFAULT_UPLOAD_DIR;
  return path.isAbsolute(configured)
    ? configured
    : path.resolve(/* turbopackIgnore: true */ process.cwd(), configured);
}

export function getUploadBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL?.trim();
  if (!configured) return DEFAULT_UPLOAD_BASE_URL;
  if (/^https?:\/\//i.test(configured)) return configured.replace(/\/+$/, "");
  const normalised = `/${configured.replace(/^\/+|\/+$/g, "")}`;
  return normalised === "/" ? DEFAULT_UPLOAD_BASE_URL : normalised;
}

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

export function buildUploadKey(folder: string, fileName: string): string {
  const { base, ext } = sanitizeFileName(fileName);
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const year = new Date().getFullYear();
  const suffix = `${Date.now()}-${randomBytes(4).toString("hex")}`;
  return `${cleanFolder}/${year}/${base}-${suffix}${ext}`;
}

function joinUploadBase(key: string): string {
  const base = getUploadBaseUrl();
  const cleanKey = stripLegacyUploadPrefixes(key);
  if (/^https?:\/\//i.test(base)) {
    return `${base}/${cleanKey}`;
  }
  return `${base}/${cleanKey}`.replace(/\/{2,}/g, "/");
}

export function getPublicUploadUrl(pathOrKey: string | null | undefined): string | null {
  if (!pathOrKey) return pathOrKey ?? null;
  if (/^https?:\/\//i.test(pathOrKey)) return pathOrKey;
  return joinUploadBase(pathOrKey);
}

export function normalizeStoredAssetUrl(url: string | null | undefined): string | null {
  if (!url) return url ?? null;
  if (/^https?:\/\//i.test(url)) return url;
  return joinUploadBase(url);
}

function extractPathname(value: string): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) {
    try {
      return new URL(value).pathname;
    } catch {
      return null;
    }
  }
  return value;
}

export function extractUploadKey(urlOrKey: string | null | undefined): string | null {
  if (!urlOrKey) return null;

  const isAbsoluteUrl = /^https?:\/\//i.test(urlOrKey);
  const pathname = extractPathname(urlOrKey);
  if (!pathname) return null;

  const base = getUploadBaseUrl();
  const basePath = extractPathname(base);
  const legacyPath = pathname.match(/^\/?public\/uploads\/(.+)$/i);
  if (legacyPath?.[1]) return stripLeadingSlashes(legacyPath[1]);

  if (basePath) {
    const cleanBase = `/${basePath.replace(/^\/+|\/+$/g, "")}`;
    if (pathname === cleanBase) return null;
    if (pathname.startsWith(`${cleanBase}/`)) {
      return stripLeadingSlashes(pathname.slice(cleanBase.length + 1));
    }
  }

  if (isAbsoluteUrl) return null;

  const relativeLegacyPath = pathname.match(/^\/?uploads\/(.+)$/i);
  if (relativeLegacyPath?.[1]) {
    return stripLeadingSlashes(relativeLegacyPath[1]);
  }

  // Allow relative keys already stored without any prefix.
  if (!pathname.startsWith("/") && pathname.includes("/")) {
    return stripLeadingSlashes(pathname);
  }
  return null;
}

function resolveManagedUploadPath(key: string): string {
  const uploadDir = getUploadDir();
  const candidate = path.resolve(uploadDir, key);
  const relative = path.relative(uploadDir, candidate);
  if (
    relative.startsWith("..") ||
    path.isAbsolute(relative) ||
    relative.includes(`..${path.sep}`)
  ) {
    throw new Error("Invalid upload path.");
  }
  return candidate;
}

export async function saveUploadedFile(
  file: File,
  folder: string,
): Promise<UploadFileResult> {
  const key = buildUploadKey(folder, file.name || "file");
  const absolutePath = resolveManagedUploadPath(key);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);
  return {
    key,
    url: getPublicUploadUrl(key)!,
    absolutePath,
  };
}

export async function deleteStoredUploadFile(
  urlOrKey: string | null | undefined,
): Promise<void> {
  const key = extractUploadKey(urlOrKey);
  if (!key) return;
  const absolutePath = resolveManagedUploadPath(key);
  await rm(absolutePath, { force: true });
}

export async function readStoredUpload(
  key: string,
): Promise<{ absolutePath: string; buffer: Buffer; size: number }> {
  const absolutePath = resolveManagedUploadPath(key);
  const info = await stat(absolutePath);
  if (!info.isFile()) {
    throw new Error("Upload not found.");
  }
  const buffer = await readFile(absolutePath);
  return { absolutePath, buffer, size: info.size };
}

export function getContentTypeForPath(filePath: string): string {
  switch (path.extname(filePath).toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".ico":
      return "image/x-icon";
    case ".svg":
      return "image/svg+xml";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

export function normalizeSiteSettingsAssets<T extends {
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  heroImageUrl?: string | null;
}>(settings: T): T {
  return {
    ...settings,
    avatarUrl: normalizeStoredAssetUrl(settings.avatarUrl),
    resumeUrl: normalizeStoredAssetUrl(settings.resumeUrl),
    logoUrl: normalizeStoredAssetUrl(settings.logoUrl),
    faviconUrl: normalizeStoredAssetUrl(settings.faviconUrl),
    heroImageUrl: normalizeStoredAssetUrl(settings.heroImageUrl),
  };
}
