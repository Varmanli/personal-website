"use client";

import { useRef, useState } from "react";
import { FiPlus, FiX, FiLoader, FiMove } from "react-icons/fi";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import {
  FieldLabel,
  FieldHint,
  FieldError,
} from "@/components/admin/forms/fields";
import type { UploadType } from "@/components/admin/forms/FileUploadField";

interface GalleryUploadFieldProps {
  name: string;
  label: string;
  type: UploadType;
  defaultValue?: string[] | null;
  hint?: string;
  error?: string;
}

const ACCEPT_IMAGE = "image/jpeg,image/png,image/webp,image/gif";

/**
 * Multi-image gallery uploader. Holds an ordered list of URLs, supports
 * drag-and-drop reordering + per-thumbnail remove, and serialises the list into
 * a single hidden input (newline-separated) under `name` — so the server action
 * parses it with the existing `list()` helper and no field names change.
 */
export function GalleryUploadField({
  name,
  label,
  type,
  defaultValue,
  hint,
  error,
}: GalleryUploadFieldProps) {
  const { dict } = useI18n();
  const u = dict.admin.upload;

  const [urls, setUrls] = useState<string[]>(
    (defaultValue ?? []).filter(Boolean),
  );
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const displayError = error ?? localError ?? undefined;

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    setLocalError(null);
    const added: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        body.append("type", type);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const json = (await res.json()) as
          | { ok: true; url: string }
          | { ok: false; error?: string };
        if (!res.ok || !json.ok) {
          throw new Error(("error" in json && json.error) || u.failed);
        }
        added.push(json.url);
      }
      setUrls((prev) => [...prev, ...added]);
    } catch (err) {
      // Keep whatever uploaded successfully before the failure.
      if (added.length) setUrls((prev) => [...prev, ...added]);
      setLocalError(err instanceof Error ? err.message : u.failed);
    } finally {
      setUploading(false);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) void uploadFiles(e.target.files);
    e.target.value = "";
  }

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function reorder(from: number, to: number) {
    if (from === to) return;
    setUrls((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>

      {/* Serialized value — one URL per line. */}
      <input type="hidden" name={name} value={urls.join("\n")} />

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {urls.map((url, index) => (
          <div
            key={`${url}-${index}`}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex !== null) reorder(dragIndex, index);
              setDragIndex(null);
            }}
            onDragEnd={() => setDragIndex(null)}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-xl border border-border bg-background/40",
              dragIndex === index && "opacity-50",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <span className="absolute start-1.5 top-1.5 inline-flex h-5 w-5 cursor-grab items-center justify-center rounded-md bg-background/70 text-xs text-muted backdrop-blur">
              <FiMove />
            </span>
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label={u.remove}
              className="absolute end-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-red-500/20 text-xs text-red-200 opacity-0 backdrop-blur transition-opacity hover:bg-red-500/40 group-hover:opacity-100"
            >
              <FiX />
            </button>
          </div>
        ))}

        {/* Add tile */}
        <button
          type="button"
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.length && dragIndex === null) {
              void uploadFiles(e.dataTransfer.files);
            }
          }}
          aria-busy={uploading}
          className={cn(
            "flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-strong bg-background/40 text-xs text-muted transition-all hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
            uploading && "cursor-wait",
          )}
        >
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-2/60 text-primary-light",
              uploading && "animate-spin",
            )}
          >
            {uploading ? <FiLoader /> : <FiPlus />}
          </span>
          {uploading ? u.uploading : u.addImages}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_IMAGE}
        multiple
        onChange={onPick}
        className="hidden"
        tabIndex={-1}
      />

      {displayError ? (
        <FieldError>{displayError}</FieldError>
      ) : (
        <FieldHint>{hint ?? u.galleryHint}</FieldHint>
      )}
    </div>
  );
}
