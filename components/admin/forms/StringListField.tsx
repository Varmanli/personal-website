"use client";

import { useState } from "react";
import { FiPlus, FiX, FiMove } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { FieldLabel, FieldHint, FieldError } from "@/components/admin/forms/fields";

interface StringListFieldProps {
  name: string;
  label: string;
  defaultValue?: string[] | string | null;
  placeholder?: string;
  hint?: string;
  error?: string;
  dir?: "rtl" | "ltr";
  addLabel?: string;
}

function toArray(value: StringListFieldProps["defaultValue"]): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    // Legacy single value possibly stored as multi-line text.
    return value.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

/**
 * Editable list of short strings (e.g. project challenges). Renders one glass
 * row per item with add/remove + drag-to-reorder, and serialises into a single
 * hidden input (one item per line) under `name` — matching the server action's
 * `list()` parser, so no field-name or parser changes are needed.
 */
export function StringListField({
  name,
  label,
  defaultValue,
  placeholder,
  hint,
  error,
  dir,
  addLabel = "+",
}: StringListFieldProps) {
  const [items, setItems] = useState<string[]>(toArray(defaultValue));
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const serialized = items.map((s) => s.trim()).filter(Boolean).join("\n");

  function update(i: number, value: string) {
    setItems((prev) => prev.map((item, idx) => (idx === i ? value : item)));
  }
  function add() {
    setItems((prev) => [...prev, ""]);
  }
  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function reorder(from: number, to: number) {
    if (from === to) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>

      {/* Serialized value — one item per line. */}
      <input type="hidden" name={name} value={serialized} />

      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 rounded-2xl border border-border bg-background/40 p-2 backdrop-blur transition-opacity",
              dragIndex === i && "opacity-50",
            )}
          >
            <span
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex !== null) reorder(dragIndex, i);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className="flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded-lg text-faint hover:text-muted"
              aria-hidden
            >
              <FiMove />
            </span>
            <input
              type="text"
              dir={dir}
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className="field-control flex-1"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/20 text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10"
              aria-label="remove"
            >
              <FiX />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-border-strong bg-background/30 px-3.5 py-2 text-sm font-medium text-muted transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary-light"
        >
          <FiPlus /> {addLabel}
        </button>
      </div>

      {error ? (
        <FieldError>{error}</FieldError>
      ) : hint ? (
        <FieldHint>{hint}</FieldHint>
      ) : null}
    </div>
  );
}
