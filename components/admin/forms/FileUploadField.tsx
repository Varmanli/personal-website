"use client";

import { useRef, useState } from "react";
import {
  FiUploadCloud,
  FiX,
  FiFileText,
  FiLink,
  FiCheck,
  FiLoader,
  FiExternalLink,
} from "react-icons/fi";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { FieldLabel, FieldHint, FieldError } from "@/components/admin/forms/fields";

export type UploadType =
  | "logo"
  | "favicon"
  | "hero"
  | "profile"
  | "resume"
  | "project"
  | "service"
  | "general";

interface FileUploadFieldProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  value?: string;
  onChange?: (value: string) => void;
  type: UploadType;
  accept?: string;
  hint?: string;
  error?: string;
  preview?: "image" | "document" | "auto";
  shape?: "square" | "wide" | "avatar" | "favicon";
  dir?: "rtl" | "ltr";
  required?: boolean;
}

type Status = "idle" | "uploading" | "success" | "error";

const ACCEPT_IMAGE = "image/jpeg,image/png,image/webp";
const ACCEPT_FAVICON = `${ACCEPT_IMAGE},image/x-icon,image/vnd.microsoft.icon`;
const ACCEPT_DOC = "application/pdf";

function defaultAccept(type: UploadType): string {
  if (type === "resume") return ACCEPT_DOC;
  if (type === "favicon") return ACCEPT_FAVICON;
  return ACCEPT_IMAGE;
}

function resolvePreview(
  preview: FileUploadFieldProps["preview"],
  type: UploadType,
): "image" | "document" {
  if (preview && preview !== "auto") return preview;
  return type === "resume" ? "document" : "image";
}

const shapeBox: Record<NonNullable<FileUploadFieldProps["shape"]>, string> = {
  wide: "aspect-video w-full",
  square: "aspect-square w-full max-w-[12rem]",
  avatar: "aspect-square w-full max-w-[10rem]",
  favicon: "aspect-square w-full max-w-[6rem]",
};

/** "object-contain" for marks/avatars, "object-cover" for photographic art. */
function objectFit(shape: NonNullable<FileUploadFieldProps["shape"]>): string {
  return shape === "wide" ? "object-cover" : "object-contain";
}

function fileNameFromUrl(url: string): string {
  try {
    const path = new URL(url, "http://x").pathname;
    return decodeURIComponent(path.split("/").pop() || url);
  } catch {
    return url;
  }
}

/**
 * Reusable admin uploader. Renders a hidden input carrying the file URL under
 * `name`, so existing server actions keep working unchanged. Supports
 * drag-and-drop, click-to-select, preview, remove/replace, and a manual-URL
 * fallback. Only this component holds local state — the form stays uncontrolled.
 */
export function FileUploadField({
  name,
  label,
  defaultValue,
  value,
  onChange,
  type,
  accept,
  hint,
  error,
  preview = "auto",
  shape = "wide",
  dir,
  required,
}: FileUploadFieldProps) {
  const { dict } = useI18n();
  const u = dict.admin.upload;

  const [internalUrl, setInternalUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [localError, setLocalError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const kind = resolvePreview(preview, type);
  const isRound = shape === "avatar";
  const displayError = error ?? localError ?? undefined;
  const busy = status === "uploading";
  const url = value ?? internalUrl;

  function setUrl(next: string) {
    if (value === undefined) setInternalUrl(next);
    onChange?.(next);
  }

  async function uploadFile(file: File) {
    setStatus("uploading");
    setLocalError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("type", type);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const json = (await res.json()) as
        | { ok: true; url: string }
        | { ok: false; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(("error" in json && json.error) || u.failed);
      }
      setUrl(json.url);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setLocalError(err instanceof Error ? err.message : u.failed);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
    // Reset so picking the same file again re-triggers change.
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (busy) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  }

  function clearValue() {
    setUrl("");
    setStatus("idle");
    setLocalError(null);
  }

  const hasValue = url.trim().length > 0;

  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={`${name}-uploader`} required={required}>
        {label}
      </FieldLabel>

      {/* Hidden input — the real form value (URL). Field name is preserved. */}
      <input type="hidden" name={name} value={url} />

      {hasValue && !busy ? (
        /* ---------------------------------- Preview --------------------------- */
        <div
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-border bg-background/40 backdrop-blur",
            kind === "image" ? shapeBox[shape] : "w-full",
            isRound && "rounded-full",
          )}
        >
          {kind === "image" ? (
            // Admin-only preview — plain <img> avoids next/image host config.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={label}
              className={cn("h-full w-full", objectFit(shape))}
            />
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2/60 text-xl text-primary-light">
                <FiFileText />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {fileNameFromUrl(url)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-primary-light">
                  {u.openFile} <FiExternalLink className="text-[0.7rem]" />
                </span>
              </span>
            </a>
          )}

          {/* Hover overlay actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/70 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border border-border bg-surface-2/80 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary-light"
            >
              {u.replace}
            </button>
            <button
              type="button"
              onClick={clearValue}
              className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:border-red-500/50"
            >
              <FiX /> {u.remove}
            </button>
          </div>

          {status === "success" && (
            <span className="absolute end-2 top-2 inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[0.7rem] font-medium text-success">
              <FiCheck /> {u.uploaded}
            </span>
          )}
        </div>
      ) : (
        /* --------------------------------- Dropzone --------------------------- */
        <button
          type="button"
          id={`${name}-uploader`}
          onClick={() => !busy && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!busy) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          aria-busy={busy}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-6 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
            kind === "image" ? shapeBox[shape] : "min-h-32",
            isRound && "rounded-full",
            dragging
              ? "border-primary/70 bg-primary/10 shadow-[0_0_30px_-8px_rgba(79,124,255,0.5)]"
              : "border-border-strong bg-background/40 hover:border-primary/50 hover:bg-primary/5",
            displayError && "border-red-400/60",
            busy && "cursor-wait",
          )}
        >
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-2/60 text-xl text-primary-light",
              busy && "animate-spin",
            )}
          >
            {busy ? <FiLoader /> : <FiUploadCloud />}
          </span>
          <span className="text-xs leading-relaxed text-muted">
            {busy ? u.uploading : u.cta}
          </span>
        </button>
      )}

      {/* Hidden native file input (shared by dropzone + replace). */}
      <input
        ref={inputRef}
        type="file"
        accept={accept ?? defaultAccept(type)}
        onChange={onPick}
        className="hidden"
        tabIndex={-1}
      />

      {/* Manual URL fallback */}
      <div className="pt-0.5">
        <button
          type="button"
          onClick={() => setManualOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-faint transition-colors hover:text-primary-light"
        >
          <FiLink className="text-[0.8rem]" />
          {manualOpen ? u.manualHide : u.manual}
        </button>
        {manualOpen && (
          <input
            type="url"
            dir={dir ?? "ltr"}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setStatus("idle");
              setLocalError(null);
            }}
            placeholder={u.urlPlaceholder}
            className="field-control mt-2"
          />
        )}
      </div>

      {displayError ? (
        <FieldError id={`${name}-error`}>{displayError}</FieldError>
      ) : hint ? (
        <FieldHint id={`${name}-hint`}>{hint}</FieldHint>
      ) : null}
    </div>
  );
}
