"use client";

import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";
import {
  FieldError,
  FieldHint,
  FieldLabel,
} from "@/components/admin/forms/fields";
import type { ProjectChallenge } from "@/types";

interface ChallengeListFieldProps {
  name: string;
  label: string;
  defaultValue?: ProjectChallenge[] | string | null;
  titleLabel?: string;
  descriptionLabel?: string;
  titlePlaceholder?: string;
  descriptionPlaceholder?: string;
  hint?: string;
  error?: string;
  dir?: "rtl" | "ltr";
  addLabel?: string;
}

function normalize(
  value?: ChallengeListFieldProps["defaultValue"],
): ProjectChallenge[] {
  if (Array.isArray(value)) {
    return value.map((item, index) => ({
      title:
        typeof item?.title === "string" && item.title.trim()
          ? item.title.trim()
          : `Challenge ${index + 1}`,
      description:
        typeof item?.description === "string" ? item.description.trim() : "",
    }));
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((description, index) => ({
        title: `Challenge ${index + 1}`,
        description,
      }));
  }

  return [];
}

export function ChallengeListField({
  name,
  label,
  defaultValue,
  titleLabel,
  descriptionLabel,
  titlePlaceholder,
  descriptionPlaceholder,
  hint,
  error,
  dir,
  addLabel = "+",
}: ChallengeListFieldProps) {
  const [items, setItems] = useState<ProjectChallenge[]>(normalize(defaultValue));

  const serialized = JSON.stringify(
    items.map((item) => ({
      title: item.title.trim(),
      description: item.description.trim(),
    })),
  );

  function update(
    index: number,
    key: keyof ProjectChallenge,
    value: string,
  ) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  }

  function add() {
    setItems((prev) => [...prev, { title: "", description: "" }]);
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
            className="grid gap-2 rounded-2xl border border-border bg-background/40 p-2.5 backdrop-blur sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto]"
          >
            <div className="space-y-1">
              {titleLabel ? (
                <p className="text-xs font-medium text-faint">{titleLabel}</p>
              ) : null}
              <input
                type="text"
                dir={dir}
                value={item.title}
                onChange={(e) => update(index, "title", e.target.value)}
                placeholder={titlePlaceholder}
                className="field-control"
              />
            </div>
            <div className="space-y-1">
              {descriptionLabel ? (
                <p className="text-xs font-medium text-faint">
                  {descriptionLabel}
                </p>
              ) : null}
              <textarea
                dir={dir}
                value={item.description}
                onChange={(e) => update(index, "description", e.target.value)}
                placeholder={descriptionPlaceholder}
                rows={3}
                className={cn("field-control min-h-24 resize-y")}
              />
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center self-start rounded-xl border border-red-500/20 text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10",
                "sm:self-auto",
              )}
              aria-label="remove challenge"
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
