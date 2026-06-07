"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

type StatusKey = "draft" | "published" | "archived" | "new" | "read";

/** Small colored status pill for admin tables (localized). */
export function StatusBadge({ status }: { status: string }) {
  const { dict } = useI18n();
  const labels = dict.admin.status;
  const label = (labels as Record<string, string>)[status] ?? status;

  const tone =
    status === "published" || status === "new"
      ? "bg-success/10 text-success border border-success/20"
      : status === "archived"
        ? "bg-surface-2 text-faint border border-border"
        : "bg-amber-500/10 text-amber-400 border border-amber-500/20";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        tone,
      )}
    >
      {label || (status as StatusKey)}
    </span>
  );
}
