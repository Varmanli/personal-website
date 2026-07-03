import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api";
import { saveUploadedFile } from "@/lib/uploads";

/**
 * POST /api/admin/upload — admin-only upload into the configured persistent
 * upload directory, exposed publicly through `/uploads/...`.
 *
 * Accepts multipart/form-data with `file` and `type`. The `type` is mapped to a
 * server-controlled folder (clients can never choose arbitrary paths). Files are
 * validated by MIME + size, names are sanitised, and a public URL is returned.
 */

const UPLOAD_FOLDERS = {
  logo: "branding/logo",
  favicon: "branding/favicon",
  hero: "hero",
  profile: "profile",
  resume: "resume",
  project: "projects",
  service: "services",
  general: "general",
} as const;

type UploadType = keyof typeof UPLOAD_FOLDERS;

const MB = 1024 * 1024;

// Standard raster images accepted everywhere. SVG is intentionally rejected
// (it can carry scripts → stored XSS) without a dedicated sanitiser.
const IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const FAVICON_EXTRA_MIME = new Set([
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);
const DOCUMENT_MIME = new Set(["application/pdf"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const FAVICON_EXT = new Set([".ico", ".png", ".webp"]);
const DOCUMENT_EXT = new Set([".pdf"]);

const IMAGE_MAX = 5 * MB;
const DOCUMENT_MAX = 10 * MB;

// Persian-friendly error messages.
const MSG = {
  unauthorized: "دسترسی غیرمجاز.",
  noFile: "هیچ فایلی ارسال نشده است.",
  badType: "نوع آپلود نامعتبر است.",
  badMime: "نوع فایل مجاز نیست.",
  tooLargeImage: "حجم تصویر نباید بیشتر از ۵ مگابایت باشد.",
  tooLargeDoc: "حجم فایل نباید بیشتر از ۱۰ مگابایت باشد.",
  failed: "آپلود فایل با خطا مواجه شد. دوباره تلاش کنید.",
};

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status });
}

function isUploadType(value: string): value is UploadType {
  return Object.prototype.hasOwnProperty.call(UPLOAD_FOLDERS, value);
}

export async function POST(request: Request) {
  // 1) Auth — admin only.
  const auth = await requireAdmin();
  if (!auth.ok) return json({ ok: false, error: MSG.unauthorized }, 401);

  // 2) Parse multipart form.
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: MSG.noFile }, 400);
  }

  const type = String(form.get("type") ?? "");
  if (!isUploadType(type)) {
    return json({ ok: false, error: MSG.badType }, 400);
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return json({ ok: false, error: MSG.noFile }, 400);
  }

  // 3) Validate by category (document for resume, image otherwise).
  const isDocument = type === "resume";
  const mime = file.type;
  const dot = file.name.lastIndexOf(".");
  const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";

  if (isDocument) {
    if (!DOCUMENT_MIME.has(mime) || !DOCUMENT_EXT.has(ext)) {
      return json({ ok: false, error: MSG.badMime }, 415);
    }
    if (file.size > DOCUMENT_MAX) {
      return json({ ok: false, error: MSG.tooLargeDoc }, 413);
    }
  } else {
    const allowed =
      (IMAGE_MIME.has(mime) && IMAGE_EXT.has(ext)) ||
      (type === "favicon" &&
        FAVICON_EXTRA_MIME.has(mime) &&
        FAVICON_EXT.has(ext)) ||
      (type === "favicon" &&
        IMAGE_MIME.has(mime) &&
        FAVICON_EXT.has(ext));
    if (!allowed) {
      return json({ ok: false, error: MSG.badMime }, 415);
    }
    if (file.size > IMAGE_MAX) {
      return json({ ok: false, error: MSG.tooLargeImage }, 413);
    }
  }

  try {
    const { key, url } = await saveUploadedFile(file, UPLOAD_FOLDERS[type]);
    return json(
      {
        ok: true,
        url,
        key,
        fileName: file.name,
        mimeType: mime,
        size: file.size,
      },
      201,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    console.error("[upload] Failed:", message);
    return json({ ok: false, error: MSG.failed }, 500);
  }
}
