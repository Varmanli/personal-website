"use client";

import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";
import {
  FieldError,
  FieldHint,
  FieldLabel,
} from "@/components/admin/forms/fields";

interface MetricItem {
  label: string;
  value: string;
}

interface MetricListFieldProps {
  name: string;
  label: string;
  defaultValue?: MetricItem[] | null;
  labelPlaceholder?: string;
  valuePlaceholder?: string;
  hint?: string;
  error?: string;
  dir?: "rtl" | "ltr";
  addLabel?: string;
}

function normalize(items?: MetricItem[] | null): MetricItem[] {
  return (items ?? []).map((item) => ({
    label: item.label ?? "",
    value: item.value ?? "",
  }));
}

/**
 * Repeatable metric editor. Serializes to a single hidden JSON field under
 * `name`, so server actions can validate/sanitize without fragile field names.
 */
export function MetricListField({
  name,
  label,
  defaultValue,
  labelPlaceholder,
  valuePlaceholder,
  hint,
  error,
  dir,
  addLabel = "+",
}: MetricListFieldProps) {
  const [items, setItems] = useState<MetricItem[]>(normalize(defaultValue));

  const serialized = JSON.stringify(
    items.map((item) => ({
      label: item.label.trim(),
      value: item.value.trim(),
    })),
  );

  function update(index: number, key: keyof MetricItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  }

  function add() {
    setItems((prev) => [...prev, { label: "", value: "" }]);
  }

  function remove(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <input type="hidden" name={name} value={serialized} />

      <div className="space-y-2.5">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-2xl border border-border bg-background/40 p-2.5 backdrop-blur sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
          >
            <input
              type="text"
              dir={dir}
              value={item.label}
              onChange={(e) => update(index, "label", e.target.value)}
              placeholder={labelPlaceholder}
              className="field-control"
            />
            <input
              type="text"
              dir={dir}
              value={item.value}
              onChange={(e) => update(index, "value", e.target.value)}
              placeholder={valuePlaceholder}
              className="field-control"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center self-start rounded-xl border border-red-500/20 text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10",
                "sm:self-auto",
              )}
              aria-label="remove metric"
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
